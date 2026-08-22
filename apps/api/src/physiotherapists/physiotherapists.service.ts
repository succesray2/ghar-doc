import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PhysiotherapistStatus, Role, type AdminCreatePhysiotherapistInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestContext } from '../common/types/request-context';

@Injectable()
export class PhysiotherapistsService {
  private readonly logger = new Logger(PhysiotherapistsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(input: AdminCreatePhysiotherapistInput, actorId: string, ctx?: RequestContext) {
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
          role: Role.PHYSIOTHERAPIST,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          physiotherapistProfile: {
            create: {
              licenseNumber: input.licenseNumber,
              specialty: input.specialty,
              bio: input.bio,
              yearsExperience: input.yearsExperience,
              status: PhysiotherapistStatus.ACTIVE,
              reviewedAt: new Date(),
            },
          },
        },
        include: { physiotherapistProfile: true },
      });

      // Unlike Doctor's self-serve signup (which writes no initial audit
      // event), every physiotherapist account creation is admin-initiated
      // and gets its own audit row from the start.
      await tx.physiotherapistStatusEvent.create({
        data: {
          physiotherapistProfileId: user.physiotherapistProfile!.id,
          fromStatus: null,
          toStatus: PhysiotherapistStatus.ACTIVE,
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
        specialty: user.physiotherapistProfile!.specialty,
        licenseNumber: user.physiotherapistProfile!.licenseNumber,
        yearsExperience: user.physiotherapistProfile!.yearsExperience,
        status: user.physiotherapistProfile!.status,
        statusReason: user.physiotherapistProfile!.statusReason,
      };
    });
  }

  async list(filters: { status?: PhysiotherapistStatus }) {
    const physios = await this.prisma.user.findMany({
      where: { role: 'PHYSIOTHERAPIST', physiotherapistProfile: { status: filters.status } },
      include: { physiotherapistProfile: true },
      orderBy: { firstName: 'asc' },
    });

    return physios
      .filter((p) => p.physiotherapistProfile)
      .map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        specialty: p.physiotherapistProfile!.specialty,
        licenseNumber: p.physiotherapistProfile!.licenseNumber,
        yearsExperience: p.physiotherapistProfile!.yearsExperience,
        status: p.physiotherapistProfile!.status as PhysiotherapistStatus,
        statusReason: p.physiotherapistProfile!.statusReason,
      }));
  }

  async statusHistory(physioUserId: string) {
    const profile = await this.prisma.physiotherapistProfile.findUnique({ where: { userId: physioUserId } });
    if (!profile) throw new NotFoundException('Physiotherapist not found');
    return this.prisma.physiotherapistStatusEvent.findMany({
      where: { physiotherapistProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    physioUserId: string,
    toStatus: PhysiotherapistStatus,
    reason: string | undefined,
    actorId: string,
    ctx?: RequestContext,
  ) {
    const profile = await this.prisma.physiotherapistProfile.findUnique({ where: { userId: physioUserId } });
    if (!profile) throw new NotFoundException('Physiotherapist not found');
    if (profile.status === toStatus) {
      throw new BadRequestException(`Physiotherapist is already ${toStatus}`);
    }

    this.logger.log(`Physiotherapist ${physioUserId} status ${profile.status} -> ${toStatus} by admin ${actorId}`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.physiotherapistProfile.update({
        where: { userId: physioUserId },
        data: { status: toStatus, statusReason: reason ?? null, reviewedAt: new Date() },
      });

      await tx.physiotherapistStatusEvent.create({
        data: {
          physiotherapistProfileId: profile.id,
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
