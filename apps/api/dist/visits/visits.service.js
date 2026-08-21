"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const visit_status_util_1 = require("./visit-status.util");
const VISIT_INCLUDE = {
    patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
    doctor: { select: { id: true, firstName: true, lastName: true, phone: true } },
    triage: true,
};
let VisitsService = class VisitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    previewTriage(answers) {
        return (0, shared_1.classifyTriage)(answers);
    }
    async create(patientId, input) {
        const { triageAnswers, redFlagAcknowledged, ...visitFields } = input;
        const classification = (0, shared_1.classifyTriage)(triageAnswers);
        if (classification.priority === shared_1.TriagePriority.RED && !redFlagAcknowledged) {
            throw new common_1.BadRequestException({
                message: shared_1.TRIAGE_MESSAGES.RED,
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
                    ruleVersion: shared_1.TRIAGE_RULE_VERSION,
                    answers: triageAnswers,
                    priority: classification.priority,
                    matchedRedFlags: classification.matchedRedFlags,
                    redFlagAcknowledged: classification.priority === shared_1.TriagePriority.RED ? redFlagAcknowledged : false,
                },
            });
            return created;
        });
        return this.mapVisit({
            ...visit,
            triage: { priority: classification.priority, matchedRedFlags: classification.matchedRedFlags, answers: triageAnswers },
        });
    }
    async findAll(status) {
        const visits = await this.prisma.visit.findMany({
            where: status ? { status } : undefined,
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
        return visits.map((v) => this.mapVisit(v));
    }
    async findMine(patientId) {
        const visits = await this.prisma.visit.findMany({
            where: { patientId },
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
        return visits.map((v) => this.mapVisit(v));
    }
    async findAssigned(doctorId) {
        const visits = await this.prisma.visit.findMany({
            where: { doctorId },
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
        return visits.map((v) => this.mapVisit(v));
    }
    async findOneForUser(id, user) {
        const visit = await this.prisma.visit.findUnique({ where: { id }, include: VISIT_INCLUDE });
        if (!visit)
            throw new common_1.NotFoundException('Visit not found');
        this.assertCanView(visit, user);
        return this.mapVisit(visit);
    }
    async assign(id, doctorId, actor) {
        const visit = await this.getOrThrow(id);
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, shared_1.VisitStatus.ASSIGNED, actor.role)) {
            throw new common_1.BadRequestException(`Cannot assign a visit in status ${visit.status}`);
        }
        const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorId } });
        if (!doctorProfile || doctorProfile.status !== shared_1.DoctorStatus.APPROVED) {
            throw new common_1.BadRequestException('Doctor is not approved for assignment');
        }
        return this.transition(visit, shared_1.VisitStatus.ASSIGNED, actor, { doctorId });
    }
    async updateStatus(id, status, actor) {
        const visit = await this.getOrThrow(id);
        if (actor.role === shared_1.Role.DOCTOR && visit.doctorId !== actor.id) {
            throw new common_1.ForbiddenException('You are not assigned to this visit');
        }
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, status, actor.role)) {
            throw new common_1.BadRequestException(`Cannot move visit from ${visit.status} to ${status}`);
        }
        return this.transition(visit, status, actor);
    }
    async cancel(id, actor, reason) {
        const visit = await this.getOrThrow(id);
        if (actor.role === shared_1.Role.PATIENT && visit.patientId !== actor.id) {
            throw new common_1.ForbiddenException('You do not own this visit');
        }
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, shared_1.VisitStatus.CANCELLED, actor.role)) {
            throw new common_1.BadRequestException(`Cannot cancel a visit in status ${visit.status}`);
        }
        return this.transition(visit, shared_1.VisitStatus.CANCELLED, actor, { cancellationReason: reason ?? null });
    }
    async safetyStats() {
        const [byPriorityRaw, unassignedRaw, cancelled] = await Promise.all([
            this.prisma.visit.groupBy({ by: ['priority'], _count: { _all: true } }),
            this.prisma.visit.groupBy({ by: ['priority'], where: { status: shared_1.VisitStatus.REQUESTED }, _count: { _all: true } }),
            this.prisma.visit.count({ where: { status: shared_1.VisitStatus.CANCELLED } }),
        ]);
        const byPriority = { GREEN: 0, ORANGE: 0, RED: 0 };
        byPriorityRaw.forEach((r) => {
            byPriority[r.priority] = r._count._all;
        });
        const unassignedByPriority = { GREEN: 0, ORANGE: 0, RED: 0 };
        unassignedRaw.forEach((r) => {
            unassignedByPriority[r.priority] = r._count._all;
        });
        return { byPriority, cancelled, unassignedByPriority };
    }
    async transition(visit, toStatus, actor, extraData = {}) {
        const timestampField = (0, visit_status_util_1.timestampFieldFor)(toStatus);
        const result = await this.prisma.$transaction(async (tx) => {
            const claim = await tx.visit.updateMany({
                where: { id: visit.id, status: visit.status },
                data: {
                    status: toStatus,
                    ...(timestampField ? { [timestampField]: new Date() } : {}),
                    ...extraData,
                },
            });
            if (claim.count === 0) {
                throw new common_1.ConflictException('This visit was just updated — please refresh and try again.');
            }
            const updated = await tx.visit.findUniqueOrThrow({ where: { id: visit.id }, include: VISIT_INCLUDE });
            await tx.visitStatusEvent.create({
                data: {
                    visitId: visit.id,
                    fromStatus: visit.status,
                    toStatus,
                    changedById: actor.id,
                },
            });
            return updated;
        });
        return this.mapVisit(result);
    }
    async getOrThrow(id) {
        const visit = await this.prisma.visit.findUnique({ where: { id } });
        if (!visit)
            throw new common_1.NotFoundException('Visit not found');
        return visit;
    }
    assertCanView(visit, user) {
        if (user.role === shared_1.Role.ADMIN)
            return;
        if (user.role === shared_1.Role.PATIENT && visit.patientId === user.id)
            return;
        if (user.role === shared_1.Role.DOCTOR && visit.doctorId === user.id)
            return;
        throw new common_1.ForbiddenException('You do not have access to this visit');
    }
    mapVisit(visit) {
        const { triage, ...rest } = visit;
        if (!triage) {
            return { ...rest, triageSummary: null };
        }
        const answers = triage.answers;
        return {
            ...rest,
            triageSummary: {
                priority: triage.priority,
                matchedRedFlags: triage.matchedRedFlags ?? [],
                symptomIds: answers?.symptoms?.map((s) => s.symptomId) ?? [],
            },
        };
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map