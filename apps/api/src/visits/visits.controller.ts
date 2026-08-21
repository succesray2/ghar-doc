import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  CreateVisitSchema,
  AssignDoctorSchema,
  UpdateVisitStatusSchema,
  CancelVisitSchema,
  TriagePreviewSchema,
  Role,
  type VisitStatus,
  type CreateVisitInput,
  type AssignDoctorInput,
  type UpdateVisitStatusInput,
  type CancelVisitInput,
  type TriagePreviewInput,
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
  create(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateVisitSchema)) body: CreateVisitInput) {
    return this.visitsService.create(user.id, body);
  }

  @Roles(Role.PATIENT)
  @Post('triage-preview')
  previewTriage(@Body(new ZodValidationPipe(TriagePreviewSchema)) body: TriagePreviewInput) {
    return this.visitsService.previewTriage(body.triageAnswers);
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

  @Roles(Role.ADMIN)
  @Get('safety-stats')
  safetyStats() {
    return this.visitsService.safetyStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findOneForUser(id, user);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AssignDoctorSchema)) body: AssignDoctorInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.visitsService.assign(id, body.doctorId, user);
  }

  @Roles(Role.DOCTOR)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateVisitStatusSchema)) body: UpdateVisitStatusInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.visitsService.updateStatus(id, body.status, user);
  }

  @Roles(Role.PATIENT, Role.ADMIN)
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CancelVisitSchema)) body: CancelVisitInput,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.visitsService.cancel(id, user, body.reason);
  }
}
