import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import {
  DoctorStatus,
  Role,
  VisitStatus,
  TriagePriority,
  TRIAGE_RULE_VERSION,
  TRIAGE_MESSAGES,
  classifyTriage,
  type CreateVisitInput,
  type TriageAnswersInput,
  type SafetyStatsDto,
} from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types';
import type { RequestContext } from '../common/types/request-context';
import { isTransitionAllowed, timestampFieldFor } from './visit-status.util';

const VISIT_INCLUDE = {
  patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
  doctor: { select: { id: true, firstName: true, lastName: true, phone: true } },
  triage: true,
} as const;

type VisitRow = { id: string; status: string; patientId: string; doctorId: string | null };

@Injectable()
export class VisitsService {
  private readonly logger = new Logger(VisitsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Stateless — no DB write. Used by the booking wizard's Review step for
   *  instant feedback; the server independently recomputes this again on
   *  create() rather than trusting whatever the client saw here. */
  previewTriage(answers: TriageAnswersInput) {
    return classifyTriage(answers);
  }

  async create(patientId: string, input: CreateVisitInput) {
    const { triageAnswers, redFlagAcknowledged, ...visitFields } = input;
    const classification = classifyTriage(triageAnswers);

    if (classification.priority === TriagePriority.RED && !redFlagAcknowledged) {
      throw new BadRequestException({
        message: TRIAGE_MESSAGES.RED,
        priority: classification.priority,
        matchedRedFlags: classification.matchedRedFlags,
      });
    }

    const visit = await this.prisma.$transaction(async (tx) => {
      const created = await tx.visit.create({
        data: { patientId, ...visitFields, priority: classification.priority },
        include: VISIT_INCLUDE,
      });
      await tx.visitTriage.create({
        data: {
          visitId: created.id,
          ruleVersion: TRIAGE_RULE_VERSION,
          answers: triageAnswers as unknown as Prisma.InputJsonValue,
          priority: classification.priority,
          matchedRedFlags: classification.matchedRedFlags as unknown as Prisma.InputJsonValue,
          redFlagAcknowledged: classification.priority === TriagePriority.RED ? redFlagAcknowledged : false,
        },
      });
      return created;
    });

    return this.mapVisit({
      ...visit,
      triage: { priority: classification.priority, matchedRedFlags: classification.matchedRedFlags, answers: triageAnswers },
    });
  }

  async findAll(status?: VisitStatus) {
    const visits = await this.prisma.visit.findMany({
      where: status ? { status } : undefined,
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
    return visits.map((v) => this.mapVisit(v));
  }

  async findMine(patientId: string) {
    const visits = await this.prisma.visit.findMany({
      where: { patientId },
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
    return visits.map((v) => this.mapVisit(v));
  }

  async findAssigned(doctorId: string) {
    const visits = await this.prisma.visit.findMany({
      where: { doctorId },
      include: VISIT_INCLUDE,
      orderBy: { requestedAt: 'desc' },
    });
    return visits.map((v) => this.mapVisit(v));
  }

  async findOneForUser(id: string, user: AuthenticatedUser) {
    const visit = await this.prisma.visit.findUnique({ where: { id }, include: VISIT_INCLUDE });
    if (!visit) throw new NotFoundException('Visit not found');
    this.assertCanView(visit, user);
    return this.mapVisit(visit);
  }

  async assign(id: string, doctorId: string, actor: AuthenticatedUser, ctx?: RequestContext) {
    const visit = await this.getOrThrow(id);
    if (!isTransitionAllowed(visit.status as VisitStatus, VisitStatus.ASSIGNED, actor.role)) {
      throw new BadRequestException(`Cannot assign a visit in status ${visit.status}`);
    }
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorId } });
    if (!doctorProfile || doctorProfile.status !== DoctorStatus.APPROVED) {
      throw new BadRequestException('Doctor is not approved for assignment');
    }
    this.logger.log(`Visit ${visit.id} assigned to doctor ${doctorId} by admin ${actor.id}`);
    return this.transition(visit, VisitStatus.ASSIGNED, actor, { doctorId }, ctx);
  }

  async updateStatus(id: string, status: VisitStatus, actor: AuthenticatedUser, ctx?: RequestContext) {
    const visit = await this.getOrThrow(id);
    if (actor.role === Role.DOCTOR && visit.doctorId !== actor.id) {
      throw new ForbiddenException('You are not assigned to this visit');
    }
    if (!isTransitionAllowed(visit.status as VisitStatus, status, actor.role)) {
      throw new BadRequestException(`Cannot move visit from ${visit.status} to ${status}`);
    }
    return this.transition(visit, status, actor, {}, ctx);
  }

  async cancel(id: string, actor: AuthenticatedUser, reason?: string, ctx?: RequestContext) {
    const visit = await this.getOrThrow(id);
    if (actor.role === Role.PATIENT && visit.patientId !== actor.id) {
      throw new ForbiddenException('You do not own this visit');
    }
    if (!isTransitionAllowed(visit.status as VisitStatus, VisitStatus.CANCELLED, actor.role)) {
      throw new BadRequestException(`Cannot cancel a visit in status ${visit.status}`);
    }
    return this.transition(visit, VisitStatus.CANCELLED, actor, { cancellationReason: reason ?? null }, ctx);
  }

  async safetyStats(): Promise<SafetyStatsDto> {
    const [byPriorityRaw, unassignedRaw, cancelled] = await Promise.all([
      this.prisma.visit.groupBy({ by: ['priority'], _count: { _all: true } }),
      this.prisma.visit.groupBy({ by: ['priority'], where: { status: VisitStatus.REQUESTED }, _count: { _all: true } }),
      this.prisma.visit.count({ where: { status: VisitStatus.CANCELLED } }),
    ]);

    const byPriority: Record<TriagePriority, number> = { GREEN: 0, ORANGE: 0, RED: 0 };
    byPriorityRaw.forEach((r) => {
      byPriority[r.priority as TriagePriority] = r._count._all;
    });

    const unassignedByPriority: Record<TriagePriority, number> = { GREEN: 0, ORANGE: 0, RED: 0 };
    unassignedRaw.forEach((r) => {
      unassignedByPriority[r.priority as TriagePriority] = r._count._all;
    });

    return { byPriority, cancelled, unassignedByPriority };
  }

  private async transition(
    visit: VisitRow,
    toStatus: VisitStatus,
    actor: AuthenticatedUser,
    extraData: Record<string, unknown> = {},
    ctx?: RequestContext,
  ) {
    const timestampField = timestampFieldFor(toStatus);

    const result = await this.prisma.$transaction(async (tx) => {
      // Conditional update keyed on the status we read earlier — if someone
      // else already moved this visit since then, `count` comes back 0
      // instead of silently overwriting their change. Prisma has no native
      // optimistic-lock field, so a status-guarded updateMany is the
      // standard substitute.
      const claim = await tx.visit.updateMany({
        where: { id: visit.id, status: visit.status as VisitStatus },
        data: {
          status: toStatus,
          ...(timestampField ? { [timestampField]: new Date() } : {}),
          ...extraData,
        },
      });
      if (claim.count === 0) {
        throw new ConflictException('This visit was just updated — please refresh and try again.');
      }
      const updated = await tx.visit.findUniqueOrThrow({ where: { id: visit.id }, include: VISIT_INCLUDE });

      await tx.visitStatusEvent.create({
        data: {
          visitId: visit.id,
          fromStatus: visit.status as VisitStatus,
          toStatus,
          changedById: actor.id,
          ipAddress: ctx?.ip,
          userAgent: ctx?.userAgent,
        },
      });

      return updated;
    });

    return this.mapVisit(result);
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

  /** Shapes the doctor/admin/patient-facing triage view — the derived
   *  summary (priority, matched red flags, which symptoms were selected),
   *  never the full raw associated-sign answer blob. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapVisit(visit: any) {
    const { triage, ...rest } = visit;
    if (!triage) {
      return { ...rest, triageSummary: null };
    }
    const answers = triage.answers as { symptoms?: { symptomId: string }[] } | null | undefined;
    return {
      ...rest,
      triageSummary: {
        priority: triage.priority,
        matchedRedFlags: triage.matchedRedFlags ?? [],
        symptomIds: answers?.symptoms?.map((s) => s.symptomId) ?? [],
      },
    };
  }
}
