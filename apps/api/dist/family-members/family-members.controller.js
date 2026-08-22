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
exports.FamilyMembersController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const family_members_service_1 = require("./family-members.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
let FamilyMembersController = class FamilyMembersController {
    familyMembersService;
    constructor(familyMembersService) {
        this.familyMembersService = familyMembersService;
    }
    findMine(user) {
        return this.familyMembersService.findMine(user.id);
    }
    create(user, body) {
        return this.familyMembersService.create(user.id, body);
    }
    update(id, user, body) {
        return this.familyMembersService.update(id, user.id, body);
    }
    remove(id, user) {
        return this.familyMembersService.remove(id, user.id);
    }
};
exports.FamilyMembersController = FamilyMembersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FamilyMembersController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.CreateFamilyMemberSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FamilyMembersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.UpdateFamilyMemberSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FamilyMembersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FamilyMembersController.prototype, "remove", null);
exports.FamilyMembersController = FamilyMembersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_1.Role.PATIENT),
    (0, common_1.Controller)('family-members'),
    __metadata("design:paramtypes", [family_members_service_1.FamilyMembersService])
], FamilyMembersController);
//# sourceMappingURL=family-members.controller.js.map