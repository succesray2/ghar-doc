import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Role, type SignupPatientInput, type SignupDoctorInput, type LoginInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types';
import type { RequestContext } from '../common/types/request-context';

interface Session {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

const DURATION_UNIT_MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

/** Runs a same-cost bcrypt compare on every "no real password to check"
 *  branch of login() (unknown email, inactive account, locked account) so
 *  response timing doesn't reveal which case occurred — computed once at
 *  module load, same cost factor (10) as real password hashes. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-a-real-password', 10);

/** Progressive lockout — escalating, always temporary, never permanent.
 *  Returns null (no lock) below the first threshold. */
function computeLockedUntil(failedAttempts: number, now: Date): Date | null {
  if (failedAttempts >= 15) return new Date(now.getTime() + 15 * 60_000);
  if (failedAttempts >= 10) return new Date(now.getTime() + 5 * 60_000);
  if (failedAttempts >= 5) return new Date(now.getTime() + 60_000);
  return null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signupPatient(input: SignupPatientInput, ctx?: RequestContext): Promise<Session> {
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

    return this.issueSession(user.id, user.email, user.role as Role, undefined, ctx);
  }

  async signupDoctor(input: SignupDoctorInput, ctx?: RequestContext): Promise<Session> {
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

    return this.issueSession(user.id, user.email, user.role as Role, undefined, ctx);
  }

  async login(input: LoginInput, ctx?: RequestContext): Promise<Session> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    const now = new Date();

    if (!user || !user.isActive || (user.lockedUntil && user.lockedUntil > now)) {
      // Same-cost dummy compare on every short-circuit branch — response
      // timing must not reveal whether the account exists, is disabled, or
      // is currently locked out.
      await bcrypt.compare(input.password, DUMMY_PASSWORD_HASH);
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      const updated = await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });
      this.logger.warn(`Failed login for ${user.email} (attempt ${updated.failedLoginAttempts})`);
      const lockedUntil = computeLockedUntil(updated.failedLoginAttempts, now);
      if (lockedUntil) {
        await this.prisma.user.update({ where: { id: user.id }, data: { lockedUntil } });
        this.logger.warn(`Account locked until ${lockedUntil.toISOString()} for ${user.email}`);
      }
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    this.logger.log(`Successful login for ${user.email}`);
    return this.issueSession(user.id, user.email, user.role as Role, undefined, ctx);
  }

  /** Refresh tokens are opaque random strings, stored only as a hash — rotated on every use.
   *  Rotation is claimed via a conditional update (not read-then-write) so two concurrent
   *  refresh calls on the same token can't both succeed. If a token that's already been
   *  rotated away gets presented again, that's reuse of a stolen/leaked token — the entire
   *  token family (every rotation descended from the same login) is revoked, forcing a full
   *  re-login rather than silently trusting the replay. */
  async refresh(presentedToken: string, ctx?: RequestContext): Promise<Session> {
    const tokenHash = this.hashToken(presentedToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const claim = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'ROTATED' },
    });

    if (claim.count === 0) {
      // Lost the race, or this exact token was already used once before —
      // either way, someone is presenting a non-current token in this
      // family. Kill the whole lineage.
      await this.prisma.refreshToken.updateMany({
        where: { familyId: stored.familyId, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'REUSE_DETECTED' },
      });
      this.logger.warn(`Refresh-token reuse detected for user ${stored.userId} — token family ${stored.familyId} revoked`);
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: stored.userId } });
    return this.issueSession(user.id, user.email, user.role as Role, stored.familyId, ctx);
  }

  async logout(presentedToken: string | null): Promise<void> {
    if (!presentedToken) return;
    const tokenHash = this.hashToken(presentedToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'USER_LOGOUT' },
    });
  }

  /** Revokes every live session for this user, on every device — not just
   *  the current one. Distinguished from reuse-detection's family-kill via
   *  revokedReason, so a bulk logout-all is never misread as token theft in
   *  the security logs. */
  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'USER_LOGOUT_ALL' },
    });
  }

  /** Live, non-expired sessions for this user — one row roughly corresponds
   *  to one signed-in device, since every refresh rotates the prior row for
   *  that device's family away. No "is this my current device" flag yet —
   *  would need a session/family claim added to the access-token JWT and
   *  threaded through every AuthenticatedUser consumer, deliberately kept
   *  out of this pass's blast radius. */
  async listSessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, userAgent: true, ip: true, createdAt: true },
    });
  }

  /** Re-verifies the current password before accepting a new one, then
   *  revokes every live session (including the current one) so the new
   *  password is required everywhere going forward — simpler and equally
   *  defensible than "all except current," which would need the same
   *  session-claim plumbing noted on listSessions(). */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('Current password is incorrect');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'PASSWORD_CHANGE' },
      }),
    ]);
    this.logger.log(`Password changed for user ${userId} — all sessions revoked`);
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

  private async issueSession(
    userId: string,
    email: string,
    role: Role,
    familyId?: string,
    ctx?: RequestContext,
  ): Promise<Session> {
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
      data: {
        userId,
        tokenHash,
        expiresAt,
        familyId: familyId ?? crypto.randomUUID(),
        userAgent: ctx?.userAgent,
        ip: ctx?.ip,
      },
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
