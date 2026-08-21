import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { VisitsModule } from './visits/visits.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FamilyMembersModule } from './family-members/family-members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidationSchema,
    }),
    // Global default; per-route @Throttle() overrides tighten this on
    // auth endpoints. In-memory storage is fine on Render's free-tier
    // single instance — revisit if this ever runs multi-instance.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    VisitsModule,
    NotificationsModule,
    FamilyMembersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
