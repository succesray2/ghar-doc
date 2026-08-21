import { DoctorStatus } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestContext } from '../common/types/request-context';
export declare class DoctorsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    list(filters: {
        status?: DoctorStatus;
        isAvailable?: boolean;
    }): Promise<{
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
    statusHistory(doctorUserId: string): Promise<{
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
    updateStatus(doctorUserId: string, toStatus: DoctorStatus, reason: string | undefined, actorId: string, ctx?: RequestContext): Promise<{
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
    setAvailability(doctorUserId: string, isAvailable: boolean): Promise<{
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
