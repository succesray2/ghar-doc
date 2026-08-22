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
exports.PhysiotherapistsController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const physiotherapists_service_1 = require("./physiotherapists.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
function parseStatusFlag(value) {
    if (value === undefined)
        return undefined;
    return Object.values(shared_1.PhysiotherapistStatus).includes(value) ? value : undefined;
}
let PhysiotherapistsController = class PhysiotherapistsController {
    physiotherapistsService;
    constructor(physiotherapistsService) {
        this.physiotherapistsService = physiotherapistsService;
    }
    create(body, admin, req) {
        return this.physiotherapistsService.create(body, admin.id, { ip: req.ip, userAgent: req.headers['user-agent'] });
    }
    list(status) {
        return this.physiotherapistsService.list({ status: parseStatusFlag(status) });
    }
    statusHistory(id) {
        return this.physiotherapistsService.statusHistory(id);
    }
    updateStatus(id, body, admin, req) {
        return this.physiotherapistsService.updateStatus(id, body.status, body.reason, admin.id, {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        });
    }
};
exports.PhysiotherapistsController = PhysiotherapistsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.AdminCreatePhysiotherapistSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PhysiotherapistsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysiotherapistsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id/status-history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysiotherapistsController.prototype, "statusHistory", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.UpdatePhysiotherapistStatusSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PhysiotherapistsController.prototype, "updateStatus", null);
exports.PhysiotherapistsController = PhysiotherapistsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN),
    (0, common_1.Controller)('physiotherapists'),
    __metadata("design:paramtypes", [physiotherapists_service_1.PhysiotherapistsService])
], PhysiotherapistsController);
//# sourceMappingURL=physiotherapists.controller.js.map