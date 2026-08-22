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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const shared_1 = require("@ghar-doc/shared");
const auth_service_1 = require("./auth.service");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const REFRESH_COOKIE = 'refresh_token';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signupPatient(body, req, res) {
        const { accessToken, refreshToken, user } = await this.authService.signupPatient(body, requestContext(req));
        this.setRefreshCookie(res, refreshToken);
        return this.sessionResponse(req, accessToken, refreshToken, user);
    }
    async signupDoctor(body, req, res) {
        const { accessToken, refreshToken, user } = await this.authService.signupDoctor(body, requestContext(req));
        this.setRefreshCookie(res, refreshToken);
        return this.sessionResponse(req, accessToken, refreshToken, user);
    }
    async login(body, req, res) {
        const { accessToken, refreshToken, user } = await this.authService.login(body, requestContext(req));
        this.setRefreshCookie(res, refreshToken);
        return this.sessionResponse(req, accessToken, refreshToken, user);
    }
    async refresh(body, req, res) {
        const presented = req.cookies?.[REFRESH_COOKIE] ??
            (this.isMobileClient(req) ? body.refreshToken : undefined) ??
            null;
        if (!presented) {
            return { accessToken: null, user: null };
        }
        const { accessToken, refreshToken, user } = await this.authService.refresh(presented, requestContext(req));
        this.setRefreshCookie(res, refreshToken);
        return this.sessionResponse(req, accessToken, refreshToken, user);
    }
    async logout(body, req, res) {
        const presented = req.cookies?.[REFRESH_COOKIE] ??
            (this.isMobileClient(req) ? body.refreshToken : undefined) ??
            null;
        await this.authService.logout(presented);
        res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
        return { success: true };
    }
    async logoutAll(user, res) {
        await this.authService.logoutAll(user.id);
        res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
        return { success: true };
    }
    async sessions(user) {
        return this.authService.listSessions(user.id);
    }
    async changePassword(user, body, res) {
        await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
        res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
        return { success: true };
    }
    async me(user) {
        return this.authService.me(user.id);
    }
    isMobileClient(req) {
        return req.headers['x-client-type'] === 'mobile';
    }
    sessionResponse(req, accessToken, refreshToken, user) {
        if (this.isMobileClient(req)) {
            return { accessToken, refreshToken, user };
        }
        return { accessToken, user };
    }
    setRefreshCookie(res, token) {
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie(REFRESH_COOKIE, token, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: '/api/auth',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 3_600_000 } }),
    (0, common_1.Post)('signup/patient'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.SignupPatientSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupPatient", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 3_600_000 } }),
    (0, common_1.Post)('signup/doctor'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.SignupDoctorSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupDoctor", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60_000 } }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.LoginSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60_000 } }),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.RefreshSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.RefreshSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sessions", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 3_600_000 } }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.ChangePasswordSchema))),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
function requestContext(req) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] };
}
//# sourceMappingURL=auth.controller.js.map