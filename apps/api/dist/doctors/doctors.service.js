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
var DoctorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
let DoctorsService = DoctorsService_1 = class DoctorsService {
    prisma;
    logger = new common_1.Logger(DoctorsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(filters) {
        const doctors = await this.prisma.user.findMany({
            where: {
                role: 'DOCTOR',
                doctorProfile: {
                    status: filters.status,
                    isAvailable: filters.isAvailable,
                },
            },
            include: { doctorProfile: true },
            orderBy: { firstName: 'asc' },
        });
        return doctors
            .filter((d) => d.doctorProfile)
            .map((d) => ({
            id: d.id,
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            specialty: d.doctorProfile.specialty,
            licenseNumber: d.doctorProfile.licenseNumber,
            yearsExperience: d.doctorProfile.yearsExperience,
            status: d.doctorProfile.status,
            statusReason: d.doctorProfile.statusReason,
            isAvailable: d.doctorProfile.isAvailable,
        }));
    }
    async statusHistory(doctorUserId) {
        const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor not found');
        return this.prisma.doctorStatusEvent.findMany({
            where: { doctorProfileId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(doctorUserId, toStatus, reason, actorId, ctx) {
        const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor not found');
        if (profile.status === toStatus) {
            throw new common_1.BadRequestException(`Doctor is already ${toStatus}`);
        }
        this.logger.log(`Doctor ${doctorUserId} status ${profile.status} -> ${toStatus} by admin ${actorId}`);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.doctorProfile.update({
                where: { userId: doctorUserId },
                data: {
                    status: toStatus,
                    statusReason: reason ?? null,
                    reviewedAt: new Date(),
                },
            });
            await tx.doctorStatusEvent.create({
                data: {
                    doctorProfileId: profile.id,
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
    async setAvailability(doctorUserId, isAvailable) {
        const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        if (isAvailable && profile.status !== shared_1.DoctorStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved doctors can set themselves available');
        }
        return this.prisma.doctorProfile.update({
            where: { userId: doctorUserId },
            data: { isAvailable },
        });
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = DoctorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map