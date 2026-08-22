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
exports.FamilyMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FamilyMembersService = class FamilyMembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMine(userId) {
        return this.prisma.familyMember.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
    }
    async create(userId, input) {
        return this.prisma.familyMember.create({ data: { userId, ...input } });
    }
    async update(id, userId, input) {
        await this.assertOwned(id, userId);
        return this.prisma.familyMember.update({ where: { id }, data: input });
    }
    async remove(id, userId) {
        await this.assertOwned(id, userId);
        await this.prisma.familyMember.delete({ where: { id } });
    }
    async assertOwned(id, userId) {
        const member = await this.prisma.familyMember.findUnique({ where: { id } });
        if (!member)
            throw new common_1.NotFoundException('Family member not found');
        if (member.userId !== userId)
            throw new common_1.ForbiddenException('You do not have access to this family member');
    }
};
exports.FamilyMembersService = FamilyMembersService;
exports.FamilyMembersService = FamilyMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamilyMembersService);
//# sourceMappingURL=family-members.service.js.map