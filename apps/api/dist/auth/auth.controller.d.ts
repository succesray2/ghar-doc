import type { Request, Response } from 'express';
import { type SignupPatientInput, type SignupDoctorInput, type LoginInput, type RefreshInput } from '@ghar-doc/shared';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signupPatient(body: SignupPatientInput, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthenticatedUser;
    } | {
        accessToken: string;
        user: AuthenticatedUser;
        refreshToken?: undefined;
    }>;
    signupDoctor(body: SignupDoctorInput, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthenticatedUser;
    } | {
        accessToken: string;
        user: AuthenticatedUser;
        refreshToken?: undefined;
    }>;
    login(body: LoginInput, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthenticatedUser;
    } | {
        accessToken: string;
        user: AuthenticatedUser;
        refreshToken?: undefined;
    }>;
    refresh(body: RefreshInput, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: AuthenticatedUser;
    } | {
        accessToken: string;
        user: AuthenticatedUser;
        refreshToken?: undefined;
    } | {
        accessToken: null;
        user: null;
    }>;
    logout(body: RefreshInput, req: Request, res: Response): Promise<{
        success: boolean;
    }>;
    me(user: AuthenticatedUser): Promise<{
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
    private isMobileClient;
    private sessionResponse;
    private setRefreshCookie;
}
