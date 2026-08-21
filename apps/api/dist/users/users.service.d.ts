import type { UpdateProfileInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMe(userId: string): Promise<{
        patientProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            addressLine1: string;
            addressLine2: string | null;
            city: string;
            state: string;
            postalCode: string;
            lat: number | null;
            lng: number | null;
            dateOfBirth: Date | null;
            gender: string | null;
            emergencyContact: string | null;
            userId: string;
        } | null;
        doctorProfile: {
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
        } | null;
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        isActive: boolean;
        failedLoginAttempts: number;
        lockedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(userId: string, input: UpdateProfileInput): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        isActive: boolean;
        failedLoginAttempts: number;
        lockedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
