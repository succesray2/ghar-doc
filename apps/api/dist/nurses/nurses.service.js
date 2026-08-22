"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NursesService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
let NursesService = NursesService_1 = class NursesService {
    prisma;
    logger = new common_1.Logger(NursesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input, actorId, ctx) {
        const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: input.email,
                    passwordHash,
                    role: shared_1.Role.NURSE,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    phone: input.phone,
                    nurseProfile: {
                        create: {
                            licenseNumber: input.licenseNumber,
                            qualification: input.qualification,
                            bio: input.bio,
                            yearsExperience: input.yearsExperience,
                            status: shared_1.NurseStatus.ACTIVE,
                            reviewedAt: new Date(),
                        },
                    },
                },
                include: { nurseProfile: true },
            });
            await tx.nurseStatusEvent.create({
                data: {
                    nurseProfileId: user.nurseProfile.id,
                    fromStatus: null,
                    toStatus: shared_1.NurseStatus.ACTIVE,
                    reason: 'Account created by admin',
                    changedById: actorId,
                    ipAddress: ctx?.ip,
                    userAgent: ctx?.userAgent,
                },
            });
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                qualification: user.nurseProfile.qualification,
                licenseNumber: user.nurseProfile.licenseNumber,
                yearsExperience: user.nurseProfile.yearsExperience,
                status: user.nurseProfile.status,
                statusReason: user.nurseProfile.statusReason,
            };
        });
    }
    async list(filters) {
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
            qualification: n.nurseProfile.qualification,
            licenseNumber: n.nurseProfile.licenseNumber,
            yearsExperience: n.nurseProfile.yearsExperience,
            status: n.nurseProfile.status,
            statusReason: n.nurseProfile.statusReason,
        }));
    }
    async statusHistory(nurseUserId) {
        const profile = await this.prisma.nurseProfile.findUnique({ where: { userId: nurseUserId } });
        if (!profile)
            throw new common_1.NotFoundException('Nurse not found');
        return this.prisma.nurseStatusEvent.findMany({
            where: { nurseProfileId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(nurseUserId, toStatus, reason, actorId, ctx) {
        const profile = await this.prisma.nurseProfile.findUnique({ where: { userId: nurseUserId } });
        if (!profile)
            throw new common_1.NotFoundException('Nurse not found');
        if (profile.status === toStatus) {
            throw new common_1.BadRequestException(`Nurse is already ${toStatus}`);
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
};
exports.NursesService = NursesService;
exports.NursesService = NursesService = NursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NursesService);
//# sourceMappingURL=nurses.service.js.map