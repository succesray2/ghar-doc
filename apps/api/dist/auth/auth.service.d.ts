import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type SignupPatientInput, type SignupDoctorInput, type LoginInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types';
interface Session {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signupPatient(input: SignupPatientInput): Promise<Session>;
    signupDoctor(input: SignupDoctorInput): Promise<Session>;
    login(input: LoginInput): Promise<Session>;
    refresh(presentedToken: string): Promise<Session>;
    logout(presentedToken: string | null): Promise<void>;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    private assertEmailFree;
    private issueSession;
    private hashToken;
    private addDuration;
}
export {};
