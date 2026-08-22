import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  CreateVisitSchema,
  AssignProviderSchema,
  UpdateVisitStatusSchema,
  CancelVisitSchema,
  TriagePreviewSchema,
  SafetyNetPreviewSchema,
  Role,
  type VisitStatus,
  type ServiceType,
  type CreateVisitInput,
  type AssignProviderInput,
  type UpdateVisitStatusInput,
  type CancelVisitInput,
  type TriagePreviewInput,
  type SafetyNetPreviewInput,
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

  @Roles(Role.PATIENT)
  @Post('safety-check-preview')
  previewSafetyNet(@Body(new ZodValidationPipe(SafetyNetPreviewSchema)) body: SafetyNetPreviewInput) {
    return this.visitsService.previewSafetyNet(body.safetyCheckAnswers);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('status') status?: VisitStatus, @Query('serviceType') serviceType?: ServiceType) {
    return this.visitsService.findAll(status, serviceType);
  }

  @Roles(Role.PATIENT)
  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findMine(user.id);
  }

  @Roles(Role.DOCTOR, Role.NURSE, Role.PHYSIOTHERAPIST)
  @Get('assigned')
  findAssigned(@CurrentUser() user: AuthenticatedUser) {
    return this.visitsService.findAssigned(user);
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
    @Body(new ZodValidationPipe(AssignProviderSchema)) body: AssignProviderInput,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const providerId = body.doctorId ?? body.nurseId ?? body.physiotherapistId;
    return this.visitsService.assign(id, providerId as string, user, requestContext(req));
  }

  @Roles(Role.DOCTOR, Role.NURSE, Role.PHYSIOTHERAPIST, Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateVisitStatusSchema)) body: UpdateVisitStatusInput,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.visitsService.updateStatus(id, body.status, user, requestContext(req));
  }

  @Roles(Role.PATIENT, Role.ADMIN)
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CancelVisitSchema)) body: CancelVisitInput,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.visitsService.cancel(id, user, body.reason, requestContext(req));
  }
}

/** IP/user-agent for the audit-trail row — purely forensic, never used for
 *  any access-control decision. Accurate because main.ts sets trust proxy. */
function requestContext(req: Request) {
  return { ip: req.ip, userAgent: req.headers['user-agent'] };
}
