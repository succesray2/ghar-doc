import { z } from 'zod';
import { NurseStatus, PhysiotherapistStatus } from './enums';
export declare const AdminCreateNurseSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    licenseNumber: z.ZodString;
    qualification: z.ZodString;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    qualification: string;
    phone?: string | undefined;
    yearsExperience?: number | undefined;
    bio?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    qualification: string;
    phone?: unknown;
    yearsExperience?: number | undefined;
    bio?: string | undefined;
}>;
export type AdminCreateNurseInput = z.infer<typeof AdminCreateNurseSchema>;
export declare const AdminCreatePhysiotherapistSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    licenseNumber: z.ZodString;
    specialty: z.ZodString;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    specialty: string;
    phone?: string | undefined;
    yearsExperience?: number | undefined;
    bio?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    specialty: string;
    phone?: unknown;
    yearsExperience?: number | undefined;
    bio?: string | undefined;
}>;
export type AdminCreatePhysiotherapistInput = z.infer<typeof AdminCreatePhysiotherapistSchema>;
export declare const UpdateNurseStatusSchema: z.ZodObject<{
    status: z.ZodEnum<[NurseStatus, ...NurseStatus[]]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: NurseStatus;
    reason?: string | undefined;
}, {
    status: NurseStatus;
    reason?: string | undefined;
}>;
export type UpdateNurseStatusInput = z.infer<typeof UpdateNurseStatusSchema>;
export declare const UpdatePhysiotherapistStatusSchema: z.ZodObject<{
    status: z.ZodEnum<[PhysiotherapistStatus, ...PhysiotherapistStatus[]]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: PhysiotherapistStatus;
    reason?: string | undefined;
}, {
    status: PhysiotherapistStatus;
    reason?: string | undefined;
}>;
export type UpdatePhysiotherapistStatusInput = z.infer<typeof UpdatePhysiotherapistStatusSchema>;
