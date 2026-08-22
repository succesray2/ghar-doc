import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type SignupPatientInput, type SignupDoctorInput, type LoginInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types';
import type { RequestContext } from '../common/types/request-context';
interface Session {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signupPatient(input: SignupPatientInput, ctx?: RequestContext): Promise<Session>;
    signupDoctor(input: SignupDoctorInput, ctx?: RequestContext): Promise<Session>;
    login(input: LoginInput, ctx?: RequestContext): Promise<Session>;
    refresh(presentedToken: string, ctx?: RequestContext): Promise<Session>;
    logout(presentedToken: string | null): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    listSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userAgent: string | null;
        ip: string | null;
    }[]>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    me(userId: string): Promise<{
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
        mfaEnabled: boolean;
        mfaSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private assertEmailFree;
    private issueSession;
    private hashToken;
    private addDuration;
}
export {};
