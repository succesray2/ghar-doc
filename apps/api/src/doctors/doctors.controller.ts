import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
  DoctorStatus,
  Role,
  UpdateDoctorAvailabilitySchema,
  UpdateDoctorStatusSchema,
  type UpdateDoctorAvailabilityInput,
  type UpdateDoctorStatusInput,
} from '@ghar-doc/shared';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

function parseBoolFlag(value?: string): boolean | undefined {
  return value === undefined ? undefined : value === 'true';
}

function parseStatusFlag(value?: string): DoctorStatus | undefined {
  if (value === undefined) return undefined;
  return Object.values(DoctorStatus).includes(value as DoctorStatus) ? (value as DoctorStatus) : undefined;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles(Role.ADMIN)
  @Get()
  list(@Query('status') status?: string, @Query('isAvailable') isAvailable?: string) {
    return this.doctorsService.list({
      status: parseStatusFlag(status),
      isAvailable: parseBoolFlag(isAvailable),
    });
  }

  @Roles(Role.ADMIN)
  @Get(':id/status-history')
  statusHistory(@Param('id') id: string) {
    return this.doctorsService.statusHistory(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateDoctorStatusSchema)) body: UpdateDoctorStatusInput,
    @CurrentUser() admin: AuthenticatedUser,
  ) {
    return this.doctorsService.updateStatus(id, body.status as DoctorStatus, body.reason, admin.id);
  }

  @Roles(Role.DOCTOR)
  @Patch('me/availability')
  setMyAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateDoctorAvailabilitySchema)) body: UpdateDoctorAvailabilityInput,
  ) {
    return this.doctorsService.setAvailability(user.id, body.isAvailable);
  }
}
