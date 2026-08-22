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
var VisitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const visit_status_util_1 = require("./visit-status.util");
function bookingRef(visitId) {
    return visitId.slice(-6).toUpperCase();
}
const SAFETY_NET_BLOCK_MESSAGE = 'This sounds like it may need urgent medical attention. Please request a doctor visit instead of a routine booking.';
const VISIT_INCLUDE = {
    patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
    doctor: { select: { id: true, firstName: true, lastName: true, phone: true } },
    nurse: { select: { id: true, firstName: true, lastName: true, phone: true } },
    physiotherapist: { select: { id: true, firstName: true, lastName: true, phone: true } },
    triage: true,
    safetyCheck: true,
};
let VisitsService = VisitsService_1 = class VisitsService {
    prisma;
    notifications;
    logger = new common_1.Logger(VisitsService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    previewTriage(answers) {
        return (0, shared_1.classifyTriage)(answers);
    }
    previewSafetyNet(answers) {
        return (0, shared_1.evaluateSafetyNet)(answers);
    }
    async create(patientId, input) {
        const { serviceType, triageAnswers, redFlagAcknowledged, nursingDetails, physiotherapyDetails, safetyCheckAnswers, ...commonFields } = input;
        let visit;
        if (serviceType === shared_1.ServiceType.NURSING || serviceType === shared_1.ServiceType.PHYSIOTHERAPY) {
            const { triggered } = (0, shared_1.evaluateSafetyNet)(safetyCheckAnswers);
            if (triggered) {
                throw new common_1.BadRequestException({ message: SAFETY_NET_BLOCK_MESSAGE, triggered: true });
            }
            const serviceDetails = serviceType === shared_1.ServiceType.NURSING ? nursingDetails : physiotherapyDetails;
            visit = await this.prisma.$transaction(async (tx) => {
                const created = await tx.visit.create({
                    data: {
                        patientId,
                        ...commonFields,
                        serviceType,
                        serviceDetails: serviceDetails,
                        priority: shared_1.TriagePriority.GREEN,
                    },
                    include: VISIT_INCLUDE,
                });
                await tx.visitSafetyCheck.create({
                    data: {
                        visitId: created.id,
                        ruleVersion: shared_1.SAFETY_NET_RULE_VERSION,
                        answers: safetyCheckAnswers,
                    },
                });
                return created;
            });
        }
        else {
            const classification = (0, shared_1.classifyTriage)(triageAnswers);
            if (classification.priority === shared_1.TriagePriority.RED && !redFlagAcknowledged) {
                throw new common_1.BadRequestException({
                    message: shared_1.TRIAGE_MESSAGES.RED,
                    priority: classification.priority,
                    matchedRedFlags: classification.matchedRedFlags,
                });
            }
            const created = await this.prisma.$transaction(async (tx) => {
                const v = await tx.visit.create({
                    data: { patientId, ...commonFields, serviceType, priority: classification.priority },
                    include: VISIT_INCLUDE,
                });
                await tx.visitTriage.create({
                    data: {
                        visitId: v.id,
                        ruleVersion: shared_1.TRIAGE_RULE_VERSION,
                        answers: triageAnswers,
                        priority: classification.priority,
                        matchedRedFlags: classification.matchedRedFlags,
                        redFlagAcknowledged: classification.priority === shared_1.TriagePriority.RED ? redFlagAcknowledged : false,
                    },
                });
                return v;
            });
            visit = {
                ...created,
                triage: {
                    id: '',
                    visitId: created.id,
                    ruleVersion: shared_1.TRIAGE_RULE_VERSION,
                    priority: classification.priority,
                    matchedRedFlags: classification.matchedRedFlags,
                    answers: triageAnswers,
                    redFlagAcknowledged: classification.priority === shared_1.TriagePriority.RED ? redFlagAcknowledged : false,
                    createdAt: created.createdAt,
                },
            };
        }
        await this.notifications.notify(patientId, shared_1.NotificationCategory.BOOKING_UPDATE, 'Request received', `Your GharDoc request has been received. Booking ID: ${bookingRef(visit.id)}. Our team is reviewing your request.`, visit.id);
        return this.mapVisit(visit);
    }
    async findAll(status, serviceType) {
        const visits = await this.prisma.visit.findMany({
            where: { ...(status ? { status } : {}), ...(serviceType ? { serviceType } : {}) },
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
    async findAssigned(actor) {
        const where = actor.role === shared_1.Role.NURSE
            ? { nurseId: actor.id }
            : actor.role === shared_1.Role.PHYSIOTHERAPIST
                ? { physiotherapistId: actor.id }
                : { doctorId: actor.id };
        const visits = await this.prisma.visit.findMany({
            where,
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
    async assign(id, providerId, actor, ctx) {
        const visit = await this.getOrThrow(id);
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, shared_1.VisitStatus.ASSIGNED, actor.role)) {
            throw new common_1.BadRequestException(`Cannot assign a visit in status ${visit.status}`);
        }
        let extraData;
        if (visit.serviceType === shared_1.ServiceType.NURSING) {
            const profile = await this.prisma.nurseProfile.findUnique({ where: { userId: providerId } });
            if (!profile || profile.status !== shared_1.NurseStatus.ACTIVE) {
                throw new common_1.BadRequestException('Nurse is not active for assignment');
            }
            extraData = { nurseId: providerId };
        }
        else if (visit.serviceType === shared_1.ServiceType.PHYSIOTHERAPY) {
            const profile = await this.prisma.physiotherapistProfile.findUnique({ where: { userId: providerId } });
            if (!profile || profile.status !== shared_1.PhysiotherapistStatus.ACTIVE) {
                throw new common_1.BadRequestException('Physiotherapist is not active for assignment');
            }
            extraData = { physiotherapistId: providerId };
        }
        else {
            const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId: providerId } });
            if (!doctorProfile || doctorProfile.status !== shared_1.DoctorStatus.APPROVED) {
                throw new common_1.BadRequestException('Doctor is not approved for assignment');
            }
            extraData = { doctorId: providerId };
        }
        this.logger.log(`Visit ${visit.id} (${visit.serviceType}) assigned to ${providerId} by admin ${actor.id}`);
        const updated = await this.transition(visit, shared_1.VisitStatus.ASSIGNED, actor, extraData, ctx);
        const ref = bookingRef(visit.id);
        await this.notifications.notify(visit.patientId, shared_1.NotificationCategory.PROVIDER_ASSIGNMENT, 'Provider assigned', `Your GharDoc request ${ref} has been assigned to a verified professional.`, visit.id);
        await this.notifications.notify(providerId, shared_1.NotificationCategory.PROVIDER_ASSIGNMENT, 'New visit request', `You have a new visit request. Booking ID: ${ref}.`, visit.id);
        return updated;
    }
    async updateStatus(id, status, actor, ctx) {
        const visit = await this.getOrThrow(id);
        if (actor.role === shared_1.Role.DOCTOR && visit.doctorId !== actor.id) {
            throw new common_1.ForbiddenException('You are not assigned to this visit');
        }
        if (actor.role === shared_1.Role.NURSE && visit.nurseId !== actor.id) {
            throw new common_1.ForbiddenException('You are not assigned to this visit');
        }
        if (actor.role === shared_1.Role.PHYSIOTHERAPIST && visit.physiotherapistId !== actor.id) {
            throw new common_1.ForbiddenException('You are not assigned to this visit');
        }
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, status, actor.role)) {
            throw new common_1.BadRequestException(`Cannot move visit from ${visit.status} to ${status}`);
        }
        const ref = bookingRef(visit.id);
        if (status === shared_1.VisitStatus.PROVIDER_DECLINED) {
            const clearField = visit.serviceType === shared_1.ServiceType.NURSING
                ? 'nurseId'
                : visit.serviceType === shared_1.ServiceType.PHYSIOTHERAPY
                    ? 'physiotherapistId'
                    : 'doctorId';
            const updated = await this.chainedTransition(visit, [
                { toStatus: shared_1.VisitStatus.PROVIDER_DECLINED, extraData: {} },
                { toStatus: shared_1.VisitStatus.REQUESTED, extraData: { [clearField]: null } },
            ], actor, ctx);
            await this.notifications.notify(visit.patientId, shared_1.NotificationCategory.BOOKING_UPDATE, 'Request under review', `Your GharDoc request ${ref} is being reviewed for reassignment.`, visit.id);
            return updated;
        }
        const updated = await this.transition(visit, status, actor, {}, ctx);
        if (status === shared_1.VisitStatus.PROVIDER_ACCEPTED) {
            await this.notifications.notify(visit.patientId, shared_1.NotificationCategory.PROVIDER_ASSIGNMENT, 'Provider accepted', `Your GharDoc provider has accepted booking ${ref}.`, visit.id);
        }
        else if (status === shared_1.VisitStatus.ARRIVED) {
            await this.notifications.notify(visit.patientId, shared_1.NotificationCategory.PROVIDER_ARRIVAL, 'Provider arrived', `Your GharDoc provider has arrived for booking ${ref}.`, visit.id);
        }
        else if (status === shared_1.VisitStatus.NO_PROVIDER_AVAILABLE) {
            await this.notifications.notify(visit.patientId, shared_1.NotificationCategory.BOOKING_UPDATE, 'Assignment update', `We are currently unable to assign a provider for booking ${ref}. Our support team will contact you.`, visit.id);
        }
        return updated;
    }
    async cancel(id, actor, reason, ctx) {
        const visit = await this.getOrThrow(id);
        if (actor.role === shared_1.Role.PATIENT && visit.patientId !== actor.id) {
            throw new common_1.ForbiddenException('You do not own this visit');
        }
        if (!(0, visit_status_util_1.isTransitionAllowed)(visit.status, shared_1.VisitStatus.CANCELLED, actor.role)) {
            throw new common_1.BadRequestException(`Cannot cancel a visit in status ${visit.status}`);
        }
        return this.transition(visit, shared_1.VisitStatus.CANCELLED, actor, { cancellationReason: reason ?? null }, ctx);
    }
    async safetyStats() {
        const DOCTOR_VISIT_ONLY = { serviceType: shared_1.ServiceType.DOCTOR_VISIT };
        const [byPriorityRaw, unassignedRaw, cancelled] = await Promise.all([
            this.prisma.visit.groupBy({ by: ['priority'], where: DOCTOR_VISIT_ONLY, _count: { _all: true } }),
            this.prisma.visit.groupBy({
                by: ['priority'],
                where: { ...DOCTOR_VISIT_ONLY, status: shared_1.VisitStatus.REQUESTED },
                _count: { _all: true },
            }),
            this.prisma.visit.count({ where: { ...DOCTOR_VISIT_ONLY, status: shared_1.VisitStatus.CANCELLED } }),
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
    async transition(visit, toStatus, actor, extraData = {}, ctx) {
        return this.chainedTransition(visit, [{ toStatus, extraData }], actor, ctx);
    }
    async chainedTransition(visit, hops, actor, ctx) {
        const result = await this.prisma.$transaction(async (tx) => {
            let fromStatus = visit.status;
            for (const hop of hops) {
                const timestampField = (0, visit_status_util_1.timestampFieldFor)(hop.toStatus);
                const claim = await tx.visit.updateMany({
                    where: { id: visit.id, status: fromStatus },
                    data: {
                        status: hop.toStatus,
                        ...(timestampField ? { [timestampField]: new Date() } : {}),
                        ...hop.extraData,
                    },
                });
                if (claim.count === 0) {
                    throw new common_1.ConflictException('This visit was just updated — please refresh and try again.');
                }
                await tx.visitStatusEvent.create({
                    data: {
                        visitId: visit.id,
                        fromStatus,
                        toStatus: hop.toStatus,
                        changedById: actor.id,
                        ipAddress: ctx?.ip,
                        userAgent: ctx?.userAgent,
                    },
                });
                fromStatus = hop.toStatus;
            }
            return tx.visit.findUniqueOrThrow({ where: { id: visit.id }, include: VISIT_INCLUDE });
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
        if (user.role === shared_1.Role.NURSE && visit.nurseId === user.id)
            return;
        if (user.role === shared_1.Role.PHYSIOTHERAPIST && visit.physiotherapistId === user.id)
            return;
        throw new common_1.ForbiddenException('You do not have access to this visit');
    }
    mapVisit(visit) {
        const { triage, safetyCheck: _safetyCheck, ...rest } = visit;
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
exports.VisitsService = VisitsService = VisitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map