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
};
let VisitsService = class VisitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(patientId, input) {
        return this.prisma.visit.create({
            data: { patientId, ...input },
            include: VISIT_INCLUDE,
        });
    }
    async findAll(status) {
        return this.prisma.visit.findMany({
            where: status ? { status } : undefined,
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
    }
    async findMine(patientId) {
        return this.prisma.visit.findMany({
            where: { patientId },
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
    }
    async findAssigned(doctorId) {
        return this.prisma.visit.findMany({
            where: { doctorId },
            include: VISIT_INCLUDE,
            orderBy: { requestedAt: 'desc' },
        });
    }
    async findOneForUser(id, user) {
        const visit = await this.prisma.visit.findUnique({ where: { id }, include: VISIT_INCLUDE });
        if (!visit)
            throw new common_1.NotFoundException('Visit not found');
        this.assertCanView(visit, user);
        return visit;
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
    async transition(visit, toStatus, actor, extraData = {}) {
        const timestampField = (0, visit_status_util_1.timestampFieldFor)(toStatus);
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
                    fromStatus: visit.status,
                    toStatus,
                    changedById: actor.id,
                },
            });
            return result;
        });
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
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map