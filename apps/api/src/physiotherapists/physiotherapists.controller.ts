import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  AdminCreatePhysiotherapistSchema,
  PhysiotherapistStatus,
  Role,
  UpdatePhysiotherapistStatusSchema,
  type AdminCreatePhysiotherapistInput,
  type UpdatePhysiotherapistStatusInput,
} from '@ghar-doc/shared';
import { PhysiotherapistsService } from './physiotherapists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

function parseStatusFlag(value?: string): PhysiotherapistStatus | undefined {
  if (value === undefined) return undefined;
  return Object.values(PhysiotherapistStatus).includes(value as PhysiotherapistStatus) ? (value as PhysiotherapistStatus) : undefined;
}

// Admin-only throughout -- no public signup and no self-service routes for
// this role, unlike DoctorsController's `me/availability`.
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('physiotherapists')
export class PhysiotherapistsController {
  constructor(private readonly physiotherapistsService: PhysiotherapistsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(AdminCreatePhysiotherapistSchema)) body: AdminCreatePhysiotherapistInput,
    @CurrentUser() admin: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.physiotherapistsService.create(body, admin.id, { ip: req.ip, userAgent: req.headers['user-agent'] });
  }

  @Get()
  list(@Query('status') status?: string) {
    return this.physiotherapistsService.list({ status: parseStatusFlag(status) });
  }

  @Get(':id/status-history')
  statusHistory(@Param('id') id: string) {
    return this.physiotherapistsService.statusHistory(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePhysiotherapistStatusSchema)) body: UpdatePhysiotherapistStatusInput,
    @CurrentUser() admin: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.physiotherapistsService.updateStatus(id, body.status as PhysiotherapistStatus, body.reason, admin.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
