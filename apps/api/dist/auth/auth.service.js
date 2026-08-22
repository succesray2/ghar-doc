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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const DURATION_UNIT_MS = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-a-real-password', 10);
function computeLockedUntil(failedAttempts, now) {
    if (failedAttempts >= 15)
        return new Date(now.getTime() + 15 * 60_000);
    if (failedAttempts >= 10)
        return new Date(now.getTime() + 5 * 60_000);
    if (failedAttempts >= 5)
        return new Date(now.getTime() + 60_000);
    return null;
}
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    config;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signupPatient(input, ctx) {
        await this.assertEmailFree(input.email);
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                role: shared_1.Role.PATIENT,
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
        return this.issueSession(user.id, user.email, user.role, undefined, ctx);
    }
    async signupDoctor(input, ctx) {
        await this.assertEmailFree(input.email);
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                role: shared_1.Role.DOCTOR,
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
        return this.issueSession(user.id, user.email, user.role, undefined, ctx);
    }
    async login(input, ctx) {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } });
        const now = new Date();
        if (!user || !user.isActive || (user.lockedUntil && user.lockedUntil > now)) {
            await bcrypt.compare(input.password, DUMMY_PASSWORD_HASH);
            throw new common_1.UnauthorizedException('Invalid email or password');
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
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: 0, lockedUntil: null },
            });
        }
        this.logger.log(`Successful login for ${user.email}`);
        return this.issueSession(user.id, user.email, user.role, undefined, ctx);
    }
    async refresh(presentedToken, ctx) {
        const tokenHash = this.hashToken(presentedToken);
        const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (!stored) {
            throw new common_1.UnauthorizedException('Refresh token is invalid or expired');
        }
        if (stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token is invalid or expired');
        }
        const claim = await this.prisma.refreshToken.updateMany({
            where: { id: stored.id, revokedAt: null },
            data: { revokedAt: new Date(), revokedReason: 'ROTATED' },
        });
        if (claim.count === 0) {
            await this.prisma.refreshToken.updateMany({
                where: { familyId: stored.familyId, revokedAt: null },
                data: { revokedAt: new Date(), revokedReason: 'REUSE_DETECTED' },
            });
            this.logger.warn(`Refresh-token reuse detected for user ${stored.userId} — token family ${stored.familyId} revoked`);
            throw new common_1.UnauthorizedException('Refresh token is invalid or expired');
        }
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: stored.userId } });
        return this.issueSession(user.id, user.email, user.role, stored.familyId, ctx);
    }
    async logout(presentedToken) {
        if (!presentedToken)
            return;
        const tokenHash = this.hashToken(presentedToken);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date(), revokedReason: 'USER_LOGOUT' },
        });
    }
    async logoutAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date(), revokedReason: 'USER_LOGOUT_ALL' },
        });
    }
    async listSessions(userId) {
        return this.prisma.refreshToken.findMany({
            where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userAgent: true, ip: true, createdAt: true },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) {
            throw new common_1.BadRequestException('Current password is incorrect');
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
    async me(userId) {
        return this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { patientProfile: true, doctorProfile: true },
        });
    }
    async assertEmailFree(email) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
    }
    async issueSession(userId, email, role, familyId, ctx) {
        const accessToken = this.jwt.sign({ sub: userId, email, role }, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
        });
        const refreshToken = crypto.randomBytes(48).toString('hex');
        const tokenHash = this.hashToken(refreshToken);
        const expiresAt = this.addDuration(new Date(), this.config.get('JWT_REFRESH_EXPIRES') ?? '30d');
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
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    addDuration(base, duration) {
        const match = /^(\d+)([smhd])$/.exec(duration);
        if (!match)
            return new Date(base.getTime() + DURATION_UNIT_MS.d * 30);
        return new Date(base.getTime() + Number(match[1]) * DURATION_UNIT_MS[match[2]]);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map