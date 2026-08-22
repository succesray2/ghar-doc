import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { NurseStatus, Role, type AdminCreateNurseInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestContext } from '../common/types/request-context';

@Injectable()
export class NursesService {
  private readonly logger = new Logger(NursesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(input: AdminCreateNurseInput, actorId: string, ctx?: RequestContext) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: Role.NURSE,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          nurseProfile: {
            create: {
              licenseNumber: input.licenseNumber,
              qualification: input.qualification,
              bio: input.bio,
              yearsExperience: input.yearsExperience,
              status: NurseStatus.ACTIVE,
              reviewedAt: new Date(),
            },
          },
        },
        include: { nurseProfile: true },
      });

      // Unlike Doctor's self-serve signup (which writes no initial audit
      // event), every nurse account creation is admin-initiated and gets
      // its own audit row from the start.
      await tx.nurseStatusEvent.create({
        data: {
          nurseProfileId: user.nurseProfile!.id,
          fromStatus: null,
          toStatus: NurseStatus.ACTIVE,
          reason: 'Account created by admin',
          changedById: actorId,
          ipAddress: ctx?.ip,
          userAgent: ctx?.userAgent,
        },
      });

      // Never return the raw Prisma user row here -- it includes passwordHash.
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        qualification: user.nurseProfile!.qualification,
        licenseNumber: user.nurseProfile!.licenseNumber,
        yearsExperience: user.nurseProfile!.yearsExperience,
        status: user.nurseProfile!.status,
        statusReason: user.nurseProfile!.statusReason,
      };
    });
  }

  async list(filters: { status?: NurseStatus }) {
    const nurses = await this.prisma.user.findMany({
      where: { role: 'NURSE', nurseProfile: { status: filters.status } },
      include: { nurseProfile: true },
      orderBy: { firstName: 'asc' },
    });

    return nurses
      .filter((n) => n.nurseProfile)
      .map((n) => ({
        id: n.id,
        firstName: n.firstName,
        lastName: n.lastName,
        email: n.email,
        qualification: n.nurseProfile!.qualification,
        licenseNumber: n.nurseProfile!.licenseNumber,
        yearsExperience: n.nurseProfile!.yearsExperience,
        status: n.nurseProfile!.status as NurseStatus,
        statusReason: n.nurseProfile!.statusReason,
      }));
  }

  async statusHistory(nurseUserId: string) {
    const profile = await this.prisma.nurseProfile.findUnique({ where: { userId: nurseUserId } });
    if (!profile) throw new NotFoundException('Nurse not found');
    return this.prisma.nurseStatusEvent.findMany({
      where: { nurseProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(nurseUserId: string, toStatus: NurseStatus, reason: string | undefined, actorId: string, ctx?: RequestContext) {
    const profile = await this.prisma.nurseProfile.findUnique({ where: { userId: nurseUserId } });
    if (!profile) throw new NotFoundException('Nurse not found');
    if (profile.status === toStatus) {
      throw new BadRequestException(`Nurse is already ${toStatus}`);
    }

    this.logger.log(`Nurse ${nurseUserId} status ${profile.status} -> ${toStatus} by admin ${actorId}`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.nurseProfile.update({
        where: { userId: nurseUserId },
        data: { status: toStatus, statusReason: reason ?? null, reviewedAt: new Date() },
      });

      await tx.nurseStatusEvent.create({
        data: {
          nurseProfileId: profile.id,
          fromStatus: profile.status,
          toStatus,
          reason,
          changedById: actorId,
          ipAddress: ctx?.ip,
          userAgent: ctx?.userAgent,
        },
      });

      return updated;
    });
  }
}
