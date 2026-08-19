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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const doctors_service_1 = require("./doctors.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
function parseBoolFlag(value) {
    return value === undefined ? undefined : value === 'true';
}
function parseStatusFlag(value) {
    if (value === undefined)
        return undefined;
    return Object.values(shared_1.DoctorStatus).includes(value) ? value : undefined;
}
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    list(status, isAvailable) {
        return this.doctorsService.list({
            status: parseStatusFlag(status),
            isAvailable: parseBoolFlag(isAvailable),
        });
    }
    statusHistory(id) {
        return this.doctorsService.statusHistory(id);
    }
    updateStatus(id, body, admin) {
        return this.doctorsService.updateStatus(id, body.status, body.reason, admin.id);
    }
    setMyAvailability(user, body) {
        return this.doctorsService.setAvailability(user.id, body.isAvailable);
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('isAvailable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "list", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Get)(':id/status-history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "statusHistory", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.UpdateDoctorStatusSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "updateStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.DOCTOR),
    (0, common_1.Patch)('me/availability'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.UpdateDoctorAvailabilitySchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "setMyAvailability", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('doctors'),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map