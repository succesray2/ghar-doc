import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorStatus } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: { status?: DoctorStatus; isAvailable?: boolean }) {
    const doctors = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          status: filters.status,
          isAvailable: filters.isAvailable,
        },
      },
      include: { doctorProfile: true },
      orderBy: { firstName: 'asc' },
    });

    return doctors
      .filter((d) => d.doctorProfile)
      .map((d) => ({
        id: d.id,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        specialty: d.doctorProfile!.specialty,
        licenseNumber: d.doctorProfile!.licenseNumber,
        yearsExperience: d.doctorProfile!.yearsExperience,
        status: d.doctorProfile!.status as DoctorStatus,
        statusReason: d.doctorProfile!.statusReason,
        isAvailable: d.doctorProfile!.isAvailable,
      }));
  }

  async statusHistory(doctorUserId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!profile) throw new NotFoundException('Doctor not found');
    return this.prisma.doctorStatusEvent.findMany({
      where: { doctorProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(doctorUserId: string, toStatus: DoctorStatus, reason: string | undefined, actorId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!profile) throw new NotFoundException('Doctor not found');
    if (profile.status === toStatus) {
      throw new BadRequestException(`Doctor is already ${toStatus}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.doctorProfile.update({
        where: { userId: doctorUserId },
        data: {
          status: toStatus,
          statusReason: reason ?? null,
          reviewedAt: new Date(),
        },
      });

      await tx.doctorStatusEvent.create({
        data: {
          doctorProfileId: profile.id,
          fromStatus: profile.status,
          toStatus,
          reason,
          changedById: actorId,
        },
      });

      return updated;
    });
  }

  async setAvailability(doctorUserId: string, isAvailable: boolean) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    if (isAvailable && profile.status !== DoctorStatus.APPROVED) {
      throw new BadRequestException('Only approved doctors can set themselves available');
    }
    return this.prisma.doctorProfile.update({
      where: { userId: doctorUserId },
      data: { isAvailable },
    });
  }
}
