import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  AdminCreateNurseSchema,
  NurseStatus,
  Role,
  UpdateNurseStatusSchema,
  type AdminCreateNurseInput,
  type UpdateNurseStatusInput,
} from '@ghar-doc/shared';
import { NursesService } from './nurses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

function parseStatusFlag(value?: string): NurseStatus | undefined {
  if (value === undefined) return undefined;
  return Object.values(NurseStatus).includes(value as NurseStatus) ? (value as NurseStatus) : undefined;
}

// Admin-only throughout -- no public signup and no self-service routes for
// this role, unlike DoctorsController's `me/availability`.
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('nurses')
export class NursesController {
  constructor(private readonly nursesService: NursesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(AdminCreateNurseSchema)) body: AdminCreateNurseInput,
    @CurrentUser() admin: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.nursesService.create(body, admin.id, { ip: req.ip, userAgent: req.headers['user-agent'] });
  }

  @Get()
  list(@Query('status') status?: string) {
    return this.nursesService.list({ status: parseStatusFlag(status) });
  }

  @Get(':id/status-history')
  statusHistory(@Param('id') id: string) {
    return this.nursesService.statusHistory(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateNurseStatusSchema)) body: UpdateNurseStatusInput,
    @CurrentUser() admin: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.nursesService.updateStatus(id, body.status as NurseStatus, body.reason, admin.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
