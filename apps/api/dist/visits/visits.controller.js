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
exports.VisitsController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const visits_service_1 = require("./visits.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
let VisitsController = class VisitsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    create(user, body) {
        return this.visitsService.create(user.id, body);
    }
    previewTriage(body) {
        return this.visitsService.previewTriage(body.triageAnswers);
    }
    findAll(status) {
        return this.visitsService.findAll(status);
    }
    findMine(user) {
        return this.visitsService.findMine(user.id);
    }
    findAssigned(user) {
        return this.visitsService.findAssigned(user.id);
    }
    safetyStats() {
        return this.visitsService.safetyStats();
    }
    findOne(id, user) {
        return this.visitsService.findOneForUser(id, user);
    }
    assign(id, body, user, req) {
        return this.visitsService.assign(id, body.doctorId, user, requestContext(req));
    }
    updateStatus(id, body, user, req) {
        return this.visitsService.updateStatus(id, body.status, user, requestContext(req));
    }
    cancel(id, body, user, req) {
        return this.visitsService.cancel(id, user, body.reason, requestContext(req));
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.PATIENT),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.CreateVisitSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.PATIENT),
    (0, common_1.Post)('triage-preview'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.TriagePreviewSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "previewTriage", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.PATIENT),
    (0, common_1.Get)('mine'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findMine", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.DOCTOR),
    (0, common_1.Get)('assigned'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findAssigned", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Get)('safety-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "safetyStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.AssignDoctorSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "assign", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.DOCTOR),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.UpdateVisitStatusSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "updateStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_1.Role.PATIENT, shared_1.Role.ADMIN),
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.CancelVisitSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "cancel", null);
exports.VisitsController = VisitsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitsController);
function requestContext(req) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] };
}
//# sourceMappingURL=visits.controller.js.map