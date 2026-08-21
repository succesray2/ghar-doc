import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  CreateFamilyMemberSchema,
  UpdateFamilyMemberSchema,
  Role,
  type CreateFamilyMemberInput,
  type UpdateFamilyMemberInput,
} from '@ghar-doc/shared';
import { FamilyMembersService } from './family-members.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
@Controller('family-members')
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.familyMembersService.findMine(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateFamilyMemberSchema)) body: CreateFamilyMemberInput) {
    return this.familyMembersService.create(user.id, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateFamilyMemberSchema)) body: UpdateFamilyMemberInput,
  ) {
    return this.familyMembersService.update(id, user.id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.familyMembersService.remove(id, user.id);
  }
}
