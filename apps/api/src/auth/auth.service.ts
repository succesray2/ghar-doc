import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Role, type SignupPatientInput, type SignupDoctorInput, type LoginInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types';

interface Session {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

const DURATION_UNIT_MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signupPatient(input: SignupPatientInput): Promise<Session> {
    await this.assertEmailFree(input.email);
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: Role.PATIENT,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        patientProfile: {
          create: {
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2,
            city: input.city,
            state: input.state,
            postalCode: input.postalCode,
          },
        },
      },
    });

    return this.issueSession(user.id, user.email, user.role as Role);
  }

  async signupDoctor(input: SignupDoctorInput): Promise<Session> {
    await this.assertEmailFree(input.email);
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: Role.DOCTOR,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        doctorProfile: {
          create: {
            licenseNumber: input.licenseNumber,
            specialty: input.specialty,
            bio: input.bio,
            yearsExperience: input.yearsExperience,
          },
        },
      },
    });

    return this.issueSession(user.id, user.email, user.role as Role);
  }

  async login(input: LoginInput): Promise<Session> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueSession(user.id, user.email, user.role as Role);
  }

  /** Refresh tokens are opaque random strings, stored only as a hash — rotated on every use. */
  async refresh(presentedToken: string): Promise<Session> {
    const tokenHash = this.hashToken(presentedToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: stored.userId } });
    return this.issueSession(user.id, user.email, user.role as Role);
  }

  async logout(presentedToken: string | null): Promise<void> {
    if (!presentedToken) return;
    const tokenHash = this.hashToken(presentedToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { patientProfile: true, doctorProfile: true },
    });
  }

  private async assertEmailFree(email: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
  }

  private async issueSession(userId: string, email: string, role: Role): Promise<Session> {
    const accessToken = this.jwt.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = this.addDuration(new Date(), this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '30d');

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken, user: { id: userId, email, role } };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private addDuration(base: Date, duration: string): Date {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) return new Date(base.getTime() + DURATION_UNIT_MS.d * 30);
    return new Date(base.getTime() + Number(match[1]) * DURATION_UNIT_MS[match[2]]);
  }
}
