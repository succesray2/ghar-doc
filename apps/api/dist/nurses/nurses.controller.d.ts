import type { Request } from 'express';
import { NurseStatus, type AdminCreateNurseInput, type UpdateNurseStatusInput } from '@ghar-doc/shared';
import { NursesService } from './nurses.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class NursesController {
    private readonly nursesService;
    constructor(nursesService: NursesService);
    create(body: AdminCreateNurseInput, admin: AuthenticatedUser, req: Request): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        qualification: string;
        licenseNumber: string;
        yearsExperience: number | null;
        status: import("@prisma/client").$Enums.NurseStatus;
        statusReason: string | null;
    }>;
    list(status?: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        qualification: string;
        licenseNumber: string;
        yearsExperience: number | null;
        status: NurseStatus;
        statusReason: string | null;
    }[]>;
    statusHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        userAgent: string | null;
        fromStatus: import("@prisma/client").$Enums.NurseStatus | null;
        toStatus: import("@prisma/client").$Enums.NurseStatus;
        reason: string | null;
        changedById: string;
        ipAddress: string | null;
        nurseProfileId: string;
    }[]>;
    updateStatus(id: string, body: UpdateNurseStatusInput, admin: AuthenticatedUser, req: Request): Promise<{
        status: import("@prisma/client").$Enums.NurseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        licenseNumber: string;
        bio: string | null;
        yearsExperience: number | null;
        statusReason: string | null;
        reviewedAt: Date | null;
        userId: string;
        qualification: string;
    }>;
}
