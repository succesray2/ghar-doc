import type { Request } from 'express';
import { PhysiotherapistStatus, type AdminCreatePhysiotherapistInput, type UpdatePhysiotherapistStatusInput } from '@ghar-doc/shared';
import { PhysiotherapistsService } from './physiotherapists.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class PhysiotherapistsController {
    private readonly physiotherapistsService;
    constructor(physiotherapistsService: PhysiotherapistsService);
    create(body: AdminCreatePhysiotherapistInput, admin: AuthenticatedUser, req: Request): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        specialty: string;
        licenseNumber: string;
        yearsExperience: number | null;
        status: import("@prisma/client").$Enums.PhysiotherapistStatus;
        statusReason: string | null;
    }>;
    list(status?: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        specialty: string;
        licenseNumber: string;
        yearsExperience: number | null;
        status: PhysiotherapistStatus;
        statusReason: string | null;
    }[]>;
    statusHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        userAgent: string | null;
        fromStatus: import("@prisma/client").$Enums.PhysiotherapistStatus | null;
        toStatus: import("@prisma/client").$Enums.PhysiotherapistStatus;
        reason: string | null;
        changedById: string;
        ipAddress: string | null;
        physiotherapistProfileId: string;
    }[]>;
    updateStatus(id: string, body: UpdatePhysiotherapistStatusInput, admin: AuthenticatedUser, req: Request): Promise<{
        status: import("@prisma/client").$Enums.PhysiotherapistStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        licenseNumber: string;
        specialty: string;
        bio: string | null;
        yearsExperience: number | null;
        statusReason: string | null;
        reviewedAt: Date | null;
        userId: string;
    }>;
}
