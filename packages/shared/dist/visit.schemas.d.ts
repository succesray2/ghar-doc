import { z } from 'zod';
import { VisitStatus, BookingRelation, ServiceType } from './enums';
import { DurationOption, SeverityOption } from './triage-rules';
export declare const SymptomAnswerSchema: z.ZodObject<{
    symptomId: z.ZodString;
    duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
    startedAt: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
    associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    bodyRegion: z.ZodOptional<z.ZodString>;
    numericReadings: z.ZodOptional<z.ZodObject<{
        systolic: z.ZodOptional<z.ZodNumber>;
        diastolic: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        temperatureUnit: z.ZodOptional<z.ZodEnum<["C", "F"]>>;
    }, "strip", z.ZodTypeAny, {
        systolic?: number | undefined;
        diastolic?: number | undefined;
        temperature?: number | undefined;
        temperatureUnit?: "C" | "F" | undefined;
    }, {
        systolic?: number | undefined;
        diastolic?: number | undefined;
        temperature?: number | undefined;
        temperatureUnit?: "C" | "F" | undefined;
    }>>;
    knownCondition: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    symptomId: string;
    severity?: SeverityOption | undefined;
    duration?: DurationOption | undefined;
    startedAt?: string | undefined;
    associatedSigns?: Record<string, boolean> | undefined;
    bodyRegion?: string | undefined;
    numericReadings?: {
        systolic?: number | undefined;
        diastolic?: number | undefined;
        temperature?: number | undefined;
        temperatureUnit?: "C" | "F" | undefined;
    } | undefined;
    knownCondition?: boolean | undefined;
}, {
    symptomId: string;
    severity?: SeverityOption | undefined;
    duration?: DurationOption | undefined;
    startedAt?: string | undefined;
    associatedSigns?: Record<string, boolean> | undefined;
    bodyRegion?: string | undefined;
    numericReadings?: {
        systolic?: number | undefined;
        diastolic?: number | undefined;
        temperature?: number | undefined;
        temperatureUnit?: "C" | "F" | undefined;
    } | undefined;
    knownCondition?: boolean | undefined;
}>;
export declare const TriageAnswersSchema: z.ZodObject<{
    symptoms: z.ZodArray<z.ZodObject<{
        symptomId: z.ZodString;
        duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
        startedAt: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
        associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        bodyRegion: z.ZodOptional<z.ZodString>;
        numericReadings: z.ZodOptional<z.ZodObject<{
            systolic: z.ZodOptional<z.ZodNumber>;
            diastolic: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            temperatureUnit: z.ZodOptional<z.ZodEnum<["C", "F"]>>;
        }, "strip", z.ZodTypeAny, {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        }, {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        }>>;
        knownCondition: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        symptomId: string;
        severity?: SeverityOption | undefined;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
        bodyRegion?: string | undefined;
        numericReadings?: {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        } | undefined;
        knownCondition?: boolean | undefined;
    }, {
        symptomId: string;
        severity?: SeverityOption | undefined;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
        bodyRegion?: string | undefined;
        numericReadings?: {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        } | undefined;
        knownCondition?: boolean | undefined;
    }>, "many">;
    otherSymptomText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symptoms: {
        symptomId: string;
        severity?: SeverityOption | undefined;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
        bodyRegion?: string | undefined;
        numericReadings?: {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        } | undefined;
        knownCondition?: boolean | undefined;
    }[];
    otherSymptomText?: string | undefined;
}, {
    symptoms: {
        symptomId: string;
        severity?: SeverityOption | undefined;
        duration?: DurationOption | undefined;
        startedAt?: string | undefined;
        associatedSigns?: Record<string, boolean> | undefined;
        bodyRegion?: string | undefined;
        numericReadings?: {
            systolic?: number | undefined;
            diastolic?: number | undefined;
            temperature?: number | undefined;
            temperatureUnit?: "C" | "F" | undefined;
        } | undefined;
        knownCondition?: boolean | undefined;
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
            bodyRegion: z.ZodOptional<z.ZodString>;
            numericReadings: z.ZodOptional<z.ZodObject<{
                systolic: z.ZodOptional<z.ZodNumber>;
                diastolic: z.ZodOptional<z.ZodNumber>;
                temperature: z.ZodOptional<z.ZodNumber>;
                temperatureUnit: z.ZodOptional<z.ZodEnum<["C", "F"]>>;
            }, "strip", z.ZodTypeAny, {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            }, {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            }>>;
            knownCondition: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }, {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }>, "many">;
        otherSymptomText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }, {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    triageAnswers: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
}, {
    triageAnswers: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    };
}>;
export type TriagePreviewInput = z.infer<typeof TriagePreviewSchema>;
export declare const CreateVisitSchema: z.ZodEffects<z.ZodObject<{
    serviceType: z.ZodDefault<z.ZodEnum<[ServiceType, ...ServiceType[]]>>;
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
    triageAnswers: z.ZodOptional<z.ZodObject<{
        symptoms: z.ZodArray<z.ZodObject<{
            symptomId: z.ZodString;
            duration: z.ZodOptional<z.ZodEnum<[DurationOption, ...DurationOption[]]>>;
            startedAt: z.ZodOptional<z.ZodString>;
            severity: z.ZodOptional<z.ZodEnum<[SeverityOption, ...SeverityOption[]]>>;
            associatedSigns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            bodyRegion: z.ZodOptional<z.ZodString>;
            numericReadings: z.ZodOptional<z.ZodObject<{
                systolic: z.ZodOptional<z.ZodNumber>;
                diastolic: z.ZodOptional<z.ZodNumber>;
                temperature: z.ZodOptional<z.ZodNumber>;
                temperatureUnit: z.ZodOptional<z.ZodEnum<["C", "F"]>>;
            }, "strip", z.ZodTypeAny, {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            }, {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            }>>;
            knownCondition: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }, {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }>, "many">;
        otherSymptomText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }, {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    }>>;
    redFlagAcknowledged: z.ZodDefault<z.ZodBoolean>;
    nursingDetails: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        nursingServiceType: z.ZodEnum<[import("./service-intake").NursingServiceType, ...import("./service-intake").NursingServiceType[]]>;
        otherServiceText: z.ZodOptional<z.ZodString>;
        careNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    }, {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    }>, {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    }, {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    }>>;
    physiotherapyDetails: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        conditionType: z.ZodEnum<[import("./service-intake").PhysiotherapyConditionType, ...import("./service-intake").PhysiotherapyConditionType[]]>;
        otherConditionText: z.ZodOptional<z.ZodString>;
        mobilityLevel: z.ZodEnum<[import("./service-intake").MobilityLevel, ...import("./service-intake").MobilityLevel[]]>;
        sessionGoal: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    }, {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    }>, {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    }, {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    }>>;
    safetyCheckAnswers: z.ZodOptional<z.ZodObject<{
        chestPain: z.ZodBoolean;
        breathingDifficulty: z.ZodBoolean;
        severeBleeding: z.ZodBoolean;
        lossOfConsciousnessOrConfusion: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    }, {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    serviceType: ServiceType;
    reasonForVisit: string;
    bookingFor: BookingRelation;
    redFlagAcknowledged: boolean;
    addressLine2?: string | undefined;
    safetyCheckAnswers?: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    } | undefined;
    triageAnswers?: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    nursingDetails?: {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    } | undefined;
    physiotherapyDetails?: {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    } | undefined;
}, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    reasonForVisit: string;
    addressLine2?: string | undefined;
    safetyCheckAnswers?: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    } | undefined;
    triageAnswers?: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    } | undefined;
    serviceType?: ServiceType | undefined;
    notes?: string | undefined;
    bookingFor?: BookingRelation | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    redFlagAcknowledged?: boolean | undefined;
    nursingDetails?: {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    } | undefined;
    physiotherapyDetails?: {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    } | undefined;
}>, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    serviceType: ServiceType;
    reasonForVisit: string;
    bookingFor: BookingRelation;
    redFlagAcknowledged: boolean;
    addressLine2?: string | undefined;
    safetyCheckAnswers?: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    } | undefined;
    triageAnswers?: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    nursingDetails?: {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    } | undefined;
    physiotherapyDetails?: {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    } | undefined;
}, {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    reasonForVisit: string;
    addressLine2?: string | undefined;
    safetyCheckAnswers?: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    } | undefined;
    triageAnswers?: {
        symptoms: {
            symptomId: string;
            severity?: SeverityOption | undefined;
            duration?: DurationOption | undefined;
            startedAt?: string | undefined;
            associatedSigns?: Record<string, boolean> | undefined;
            bodyRegion?: string | undefined;
            numericReadings?: {
                systolic?: number | undefined;
                diastolic?: number | undefined;
                temperature?: number | undefined;
                temperatureUnit?: "C" | "F" | undefined;
            } | undefined;
            knownCondition?: boolean | undefined;
        }[];
        otherSymptomText?: string | undefined;
    } | undefined;
    serviceType?: ServiceType | undefined;
    notes?: string | undefined;
    bookingFor?: BookingRelation | undefined;
    patientName?: string | undefined;
    patientAge?: number | undefined;
    patientSex?: string | undefined;
    caregiverName?: string | undefined;
    caregiverPhone?: string | undefined;
    redFlagAcknowledged?: boolean | undefined;
    nursingDetails?: {
        nursingServiceType: import("./service-intake").NursingServiceType;
        otherServiceText?: string | undefined;
        careNotes?: string | undefined;
    } | undefined;
    physiotherapyDetails?: {
        conditionType: import("./service-intake").PhysiotherapyConditionType;
        mobilityLevel: import("./service-intake").MobilityLevel;
        otherConditionText?: string | undefined;
        sessionGoal?: string | undefined;
    } | undefined;
}>;
export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;
export declare const AssignProviderSchema: z.ZodEffects<z.ZodObject<{
    doctorId: z.ZodOptional<z.ZodString>;
    nurseId: z.ZodOptional<z.ZodString>;
    physiotherapistId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    doctorId?: string | undefined;
    nurseId?: string | undefined;
    physiotherapistId?: string | undefined;
}, {
    doctorId?: string | undefined;
    nurseId?: string | undefined;
    physiotherapistId?: string | undefined;
}>, {
    doctorId?: string | undefined;
    nurseId?: string | undefined;
    physiotherapistId?: string | undefined;
}, {
    doctorId?: string | undefined;
    nurseId?: string | undefined;
    physiotherapistId?: string | undefined;
}>;
export type AssignProviderInput = z.infer<typeof AssignProviderSchema>;
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
