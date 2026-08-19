import { z } from 'zod';
import { VisitStatus } from './enums';
export declare const CreateVisitSchema: z.ZodObject<{
    reasonForVisit: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    reasonForVisit: string;
    addressLine2?: string | undefined;
    notes?: string | undefined;
}, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    reasonForVisit: string;
    addressLine2?: string | undefined;
    notes?: string | undefined;
}>;
export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;
export declare const AssignDoctorSchema: z.ZodObject<{
    doctorId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    doctorId: string;
}, {
    doctorId: string;
}>;
export type AssignDoctorInput = z.infer<typeof AssignDoctorSchema>;
export declare const UpdateVisitStatusSchema: z.ZodObject<{
    status: z.ZodEnum<[VisitStatus, ...VisitStatus[]]>;
}, "strip", z.ZodTypeAny, {
    status: VisitStatus;
}, {
    status: VisitStatus;
}>;
export type UpdateVisitStatusInput = z.infer<typeof UpdateVisitStatusSchema>;
export declare const CancelVisitSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export type CancelVisitInput = z.infer<typeof CancelVisitSchema>;
