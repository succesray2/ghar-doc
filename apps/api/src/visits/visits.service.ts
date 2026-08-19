import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, VisitStatus, type CreateVisitInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types';
import { isTransitionAllowed, timestampFieldFor } from './visit-status.util';

const VISIT_INCLUDE = {
  patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
  doctor: { select: { id: true, firstName: true, lastName: true, phone: true } },
} as const;

type VisitRow = { id: string; status: string; patientId: string; doctorId: string | null };

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(patientId: string, input: CreateVisitInput) {
    return this.prisma.visit.create({
      data: { patientId, ...input },
      include: VISIT_INCLUDE,
    });
  }

  async findAll(status?: VisitStatus) {
    return this.prisma.visit.findMany({
      where: status ? { status } : undefined,
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findMine(patientId: string) {
    return this.prisma.visit.findMany({
      where: { patientId },
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findAssigned(doctorId: string) {
    return this.prisma.visit.findMany({
      where: { doctorId },
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findOneForUser(id: string, user: AuthenticatedUser) {
    const visit = await this.prisma.visit.findUnique({ where: { id }, include: VISIT_INCLUDE });
    if (!visit) throw new NotFoundException('Visit not found');
    this.assertCanView(visit, user);
    return visit;
  }

  async assign(id: string, doctorId: string, actor: AuthenticatedUser) {
    const visit = await this.getOrThrow(id);
    if (!isTransitionAllowed(visit.status as VisitStatus, VisitStatus.ASSIGNED, actor.role)) {
      throw new BadRequestException(`Cannot assign a visit in status ${visit.status}`);
    }
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorId } });
    if (!doctorProfile || !doctorProfile.isApproved) {
      throw new BadRequestException('Doctor is not approved for assignment');
    }
    return this.transition(visit, VisitStatus.ASSIGNED, actor, { doctorId });
  }

  async updateStatus(id: string, status: VisitStatus, actor: AuthenticatedUser) {
    const visit = await this.getOrThrow(id);
    if (actor.role === Role.DOCTOR && visit.doctorId !== actor.id) {
      throw new ForbiddenException('You are not assigned to this visit');
    }
    if (!isTransitionAllowed(visit.status as VisitStatus, status, actor.role)) {
      throw new BadRequestException(`Cannot move visit from ${visit.status} to ${status}`);
    }
    return this.transition(visit, status, actor);
  }

  async cancel(id: string, actor: AuthenticatedUser, reason?: string) {
    const visit = await this.getOrThrow(id);
    if (actor.role === Role.PATIENT && visit.patientId !== actor.id) {
      throw new ForbiddenException('You do not own this visit');
    }
    if (!isTransitionAllowed(visit.status as VisitStatus, VisitStatus.CANCELLED, actor.role)) {
      throw new BadRequestException(`Cannot cancel a visit in status ${visit.status}`);
    }
    return this.transition(visit, VisitStatus.CANCELLED, actor, { cancellationReason: reason ?? null });
  }

  private async transition(
    visit: VisitRow,
    toStatus: VisitStatus,
    actor: AuthenticatedUser,
    extraData: Record<string, unknown> = {},
  ) {
    const timestampField = timestampFieldFor(toStatus);

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.visit.update({
        where: { id: visit.id },
        data: {
          status: toStatus,
          ...(timestampField ? { [timestampField]: new Date() } : {}),
          ...extraData,
        },
        include: VISIT_INCLUDE,
      });

      await tx.visitStatusEvent.create({
        data: {
          visitId: visit.id,
          fromStatus: visit.status as VisitStatus,
          toStatus,
          changedById: actor.id,
        },
      });

      return result;
    });
  }

  private async getOrThrow(id: string): Promise<VisitRow> {
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    if (!visit) throw new NotFoundException('Visit not found');
    return visit;
  }

  private assertCanView(visit: { patientId: string; doctorId: string | null }, user: AuthenticatedUser) {
    if (user.role === Role.ADMIN) return;
    if (user.role === Role.PATIENT && visit.patientId === user.id) return;
    if (user.role === Role.DOCTOR && visit.doctorId === user.id) return;
    throw new ForbiddenException('You do not have access to this visit');
  }
}
