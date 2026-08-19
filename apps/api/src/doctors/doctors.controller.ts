import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Role, UpdateDoctorAvailabilitySchema, type UpdateDoctorAvailabilityInput } from '@ghar-doc/shared';
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles(Role.ADMIN)
  @Get()
  list(@Query('isApproved') isApproved?: string, @Query('isAvailable') isAvailable?: string) {
    return this.doctorsService.list({
      isApproved: parseBoolFlag(isApproved),
      isAvailable: parseBoolFlag(isAvailable),
    });
  }

  @Roles(Role.ADMIN)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.doctorsService.approve(id);
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
