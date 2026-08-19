import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof LoginSchema>;
export declare const SignupPatientSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string | undefined;
    addressLine2?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string | undefined;
    addressLine2?: string | undefined;
}>;
export type SignupPatientInput = z.infer<typeof SignupPatientSchema>;
export declare const SignupDoctorSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
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
    phone?: string | undefined;
    yearsExperience?: number | undefined;
    bio?: string | undefined;
}>;
export type SignupDoctorInput = z.infer<typeof SignupDoctorSchema>;
export declare const RefreshSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
}, {
    refreshToken?: string | undefined;
}>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
