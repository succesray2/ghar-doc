import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: { isApproved?: boolean; isAvailable?: boolean }) {
    const doctors = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          isApproved: filters.isApproved,
          isAvailable: filters.isAvailable,
        },
      },
      include: { doctorProfile: true },
      orderBy: { firstName: 'asc' },
    });

    return doctors.map((d) => ({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      specialty: d.doctorProfile?.specialty ?? '',
      isApproved: d.doctorProfile?.isApproved ?? false,
      isAvailable: d.doctorProfile?.isAvailable ?? false,
    }));
  }

  async approve(doctorUserId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!profile) throw new NotFoundException('Doctor not found');
    return this.prisma.doctorProfile.update({
      where: { userId: doctorUserId },
      data: { isApproved: true },
    });
  }

  async setAvailability(doctorUserId: string, isAvailable: boolean) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    return this.prisma.doctorProfile.update({
      where: { userId: doctorUserId },
      data: { isAvailable },
    });
  }
}
