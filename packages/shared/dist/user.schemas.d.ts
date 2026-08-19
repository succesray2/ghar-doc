import { z } from 'zod';
import { DoctorStatus } from './enums';
export declare const UpdateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export declare const UpdateDoctorAvailabilitySchema: z.ZodObject<{
    isAvailable: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isAvailable: boolean;
}, {
    isAvailable: boolean;
}>;
export type UpdateDoctorAvailabilityInput = z.infer<typeof UpdateDoctorAvailabilitySchema>;
export declare const UpdateDoctorStatusSchema: z.ZodObject<{
    status: z.ZodEnum<[DoctorStatus, ...DoctorStatus[]]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: DoctorStatus;
    reason?: string | undefined;
}, {
    status: DoctorStatus;
    reason?: string | undefined;
}>;
export type UpdateDoctorStatusInput = z.infer<typeof UpdateDoctorStatusSchema>;
