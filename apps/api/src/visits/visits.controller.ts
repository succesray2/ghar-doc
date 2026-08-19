import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import {
  CreateVisitSchema,
  AssignDoctorSchema,
  UpdateVisitStatusSchema,
  CancelVisitSchema,
  Role,
  type VisitStatus,
  type CreateVisitInput,
  type AssignDoctorInput,
  type UpdateVisitStatusInput,
  type CancelVisitInput,
} from '@ghar-doc/shared';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Roles(Role.PATIENT)
  @Post()
  @UsePipes(new ZodValidationPipe(CreateVisitSchema))
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateVisitInput) {
    return this.visitsService.create(user.id, body);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('status') status?: VisitStatus) {
    return this.visitsService.findAll(status);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findMine(user.id);
  }

  @Roles(Role.DOCTOR)
  @Get('assigned')
  findAssigned(@CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findAssigned(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findOneForUser(id, user);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/assign')
  @UsePipes(new ZodValidationPipe(AssignDoctorSchema))
  assign(@Param('id') id: string, @Body() body: AssignDoctorInput, @CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.assign(id, body.doctorId, user);
  }

  @Roles(Role.DOCTOR)
  @Patch(':id/status')
  @UsePipes(new ZodValidationPipe(UpdateVisitStatusSchema))
  updateStatus(@Param('id') id: string, @Body() body: UpdateVisitStatusInput, @CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.updateStatus(id, body.status, user);
  }

  @Roles(Role.PATIENT, Role.ADMIN)
  @Patch(':id/cancel')
  @UsePipes(new ZodValidationPipe(CancelVisitSchema))
  cancel(@Param('id') id: string, @Body() body: CancelVisitInput, @CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.cancel(id, user, body.reason);
  }
}
