import { Body, Controller, Get, Patch, UseGuards, UsePipes } from '@nestjs/common';
import { UpdateProfileSchema, type UpdateProfileInput } from '@ghar-doc/shared';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '../auth/types';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findMe(user.id);
  }

  @Patch('me')
  @UsePipes(new ZodValidationPipe(UpdateProfileSchema))
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() body: UpdateProfileInput) {
    return this.usersService.updateMe(user.id, body);
  }
}
