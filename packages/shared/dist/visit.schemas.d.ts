import { z } from 'zod';
import { VisitStatus, BookingRelation } from './enums';
import { DurationOption, SeverityOption } from './triage-rules';
export declare const SymptomAnswerSchema: z.ZodObject<{
    symptomId: z.ZodString;
    duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
    startedAt: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
    associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    symptomId: string;
    duration?: DurationOption | undefined;
    startedAt?: string | undefined;
    severity?: SeverityOption | undefined;
    associatedSigns?: Record<string, boolean> | undefined;
}, {
    symptomId: string;
    duration?: DurationOption | undefined;
    startedAt?: string | undefined;
    severity?: SeverityOption | undefined;
    associatedSigns?: Record<string, boolean> | undefined;
}>;
export declare const TriageAnswersSchema: z.ZodObject<{
    symptoms: z.ZodArray<z.ZodObject<{
        symptomId: z.ZodString;
        duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
        startedAt: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
        associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        symptomId: string;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        severity?: SeverityOption | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
    }, {
        symptomId: string;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        severity?: SeverityOption | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
    }>, "many">;
    otherSymptomText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symptoms: {
        symptomId: string;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        severity?: SeverityOption | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
    }[];
    otherSymptomText?: string | undefined;
}, {
    symptoms: {
        symptomId: string;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        severity?: SeverityOption | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
    }[];
    otherSymptomText?: string | undefined;
}>;
export type TriageAnswersInput = z.infer<typeof TriageAnswersSchema>;
export declare const TriagePreviewSchema: z.ZodObject<{
    triageAnswers: z.ZodObject<{
        symptoms: z.ZodArray<z.ZodObject<{
            symptomId: z.ZodString;
            duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
            startedAt: z.ZodOptional<z.ZodString>;
            severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
            associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }, {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }>, "many">;
        otherSymptomText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }, {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
}, {
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
}>;
export type TriagePreviewInput = z.infer<typeof TriagePreviewSchema>;
export declare const CreateVisitSchema: z.ZodEffects<z.ZodObject<{
    reasonForVisit: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    bookingFor: z.ZodDefault<z.ZodEnum<[BookingRelation, ...BookingRelation[]]>>;
    patientName: z.ZodOptional<z.ZodString>;
    patientAge: z.ZodOptional<z.ZodNumber>;
    patientSex: z.ZodOptional<z.ZodString>;
    caregiverName: z.ZodOptional<z.ZodString>;
    caregiverPhone: z.ZodOptional<z.ZodString>;
    triageAnswers: z.ZodObject<{
        symptoms: z.ZodArray<z.ZodObject<{
            symptomId: z.ZodString;
            duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
            startedAt: z.ZodOptional<z.ZodString>;
            severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
            associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }, {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }>, "many">;
        otherSymptomText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }, {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }>;
    redFlagAcknowledged: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
    reasonForVisit: string;
    bookingFor: BookingRelation;
    redFlagAcknowledged: boolean;
    addressLine2?: string | undefined;
    notes?: string | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
}, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
    reasonForVisit: string;
    addressLine2?: string | undefined;
    notes?: string | undefined;
    bookingFor?: BookingRelation | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    redFlagAcknowledged?: boolean | undefined;
}>, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
    reasonForVisit: string;
    bookingFor: BookingRelation;
    redFlagAcknowledged: boolean;
    addressLine2?: string | undefined;
    notes?: string | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
}, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    triageAnswers: {
        symptoms: {
            symptomId: string;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            severity?: SeverityOption | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
    reasonForVisit: string;
    addressLine2?: string | undefined;
    notes?: string | undefined;
    bookingFor?: BookingRelation | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    redFlagAcknowledged?: boolean | undefined;
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
