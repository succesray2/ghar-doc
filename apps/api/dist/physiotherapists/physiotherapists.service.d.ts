import { PhysiotherapistStatus, type AdminCreatePhysiotherapistInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestContext } from '../common/types/request-context';
export declare class PhysiotherapistsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(input: AdminCreatePhysiotherapistInput, actorId: string, ctx?: RequestContext): Promise<{
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
    list(filters: {
        status?: PhysiotherapistStatus;
    }): Promise<{
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
    statusHistory(physioUserId: string): Promise<{
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
    updateStatus(physioUserId: string, toStatus: PhysiotherapistStatus, reason: string | undefined, actorId: string, ctx?: RequestContext): Promise<{
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
