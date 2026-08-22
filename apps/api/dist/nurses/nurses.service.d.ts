import { NurseStatus, type AdminCreateNurseInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestContext } from '../common/types/request-context';
export declare class NursesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(input: AdminCreateNurseInput, actorId: string, ctx?: RequestContext): Promise<{
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
    list(filters: {
        status?: NurseStatus;
    }): Promise<{
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
    statusHistory(nurseUserId: string): Promise<{
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
    updateStatus(nurseUserId: string, toStatus: NurseStatus, reason: string | undefined, actorId: string, ctx?: RequestContext): Promise<{
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
