import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateFamilyMemberInput, UpdateFamilyMemberInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamilyMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: string) {
    return this.prisma.familyMember.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }

  async create(userId: string, input: CreateFamilyMemberInput) {
    return this.prisma.familyMember.create({ data: { userId, ...input } });
  }

  async update(id: string, userId: string, input: UpdateFamilyMemberInput) {
    await this.assertOwned(id, userId);
    return this.prisma.familyMember.update({ where: { id }, data: input });
  }

  async remove(id: string, userId: string) {
    await this.assertOwned(id, userId);
    await this.prisma.familyMember.delete({ where: { id } });
  }

  private async assertOwned(id: string, userId: string) {
    const member = await this.prisma.familyMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Family member not found');
    if (member.userId !== userId) throw new ForbiddenException('You do not have access to this family member');
  }
}
