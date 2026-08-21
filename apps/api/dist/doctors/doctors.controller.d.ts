import type { Request } from 'express';
import { DoctorStatus, type UpdateDoctorAvailabilityInput, type UpdateDoctorStatusInput } from '@ghar-doc/shared';
import { DoctorsService } from './doctors.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    list(status?: string, isAvailable?: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        specialty: string;
        licenseNumber: string;
        yearsExperience: number | null;
        status: DoctorStatus;
        statusReason: string | null;
        isAvailable: boolean;
    }[]>;
    statusHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        doctorProfileId: string;
        fromStatus: import("@prisma/client").$Enums.DoctorStatus | null;
        toStatus: import("@prisma/client").$Enums.DoctorStatus;
        reason: string | null;
        changedById: string;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    updateStatus(id: string, body: UpdateDoctorStatusInput, admin: AuthenticatedUser, req: Request): Promise<{
        status: import("@prisma/client").$Enums.DoctorStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        licenseNumber: string;
        specialty: string;
        bio: string | null;
        yearsExperience: number | null;
        statusReason: string | null;
        reviewedAt: Date | null;
        isAvailable: boolean;
        userId: string;
    }>;
    setMyAvailability(user: AuthenticatedUser, body: UpdateDoctorAvailabilityInput): Promise<{
        status: import("@prisma/client").$Enums.DoctorStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        licenseNumber: string;
        specialty: string;
        bio: string | null;
        yearsExperience: number | null;
        statusReason: string | null;
        reviewedAt: Date | null;
        isAvailable: boolean;
        userId: string;
    }>;
}
