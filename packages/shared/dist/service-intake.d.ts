import { z } from 'zod';
export declare const NursingServiceType: {
    readonly WOUND_CARE: "WOUND_CARE";
    readonly INJECTION: "INJECTION";
    readonly IV_DRIP: "IV_DRIP";
    readonly OTHER: "OTHER";
};
export type NursingServiceType = (typeof NursingServiceType)[keyof typeof NursingServiceType];
export declare const NURSING_SERVICE_LABELS: Record<NursingServiceType, string>;
export declare const NursingServiceDetailsSchema: z.ZodEffects<z.ZodObject<{
    nursingServiceType: z.ZodEnum<[NursingServiceType, ...NursingServiceType[]]>;
    otherServiceText: z.ZodOptional<z.ZodString>;
    careNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    nursingServiceType: NursingServiceType;
    otherServiceText?: string | undefined;
    careNotes?: string | undefined;
}, {
    nursingServiceType: NursingServiceType;
    otherServiceText?: string | undefined;
    careNotes?: string | undefined;
}>, {
    nursingServiceType: NursingServiceType;
    otherServiceText?: string | undefined;
    careNotes?: string | undefined;
}, {
    nursingServiceType: NursingServiceType;
    otherServiceText?: string | undefined;
    careNotes?: string | undefined;
}>;
export type NursingServiceDetails = z.infer<typeof NursingServiceDetailsSchema>;
export declare const PhysiotherapyConditionType: {
    readonly POST_SURGERY: "POST_SURGERY";
    readonly BACK_PAIN: "BACK_PAIN";
    readonly STROKE_RECOVERY: "STROKE_RECOVERY";
    readonly SPORTS_INJURY: "SPORTS_INJURY";
    readonly CHRONIC_PAIN: "CHRONIC_PAIN";
    readonly OTHER: "OTHER";
};
export type PhysiotherapyConditionType = (typeof PhysiotherapyConditionType)[keyof typeof PhysiotherapyConditionType];
export declare const PHYSIOTHERAPY_CONDITION_LABELS: Record<PhysiotherapyConditionType, string>;
export declare const MobilityLevel: {
    readonly INDEPENDENT: "INDEPENDENT";
    readonly NEEDS_ASSISTANCE: "NEEDS_ASSISTANCE";
    readonly WHEELCHAIR: "WHEELCHAIR";
    readonly BEDBOUND: "BEDBOUND";
};
export type MobilityLevel = (typeof MobilityLevel)[keyof typeof MobilityLevel];
export declare const MOBILITY_LEVEL_LABELS: Record<MobilityLevel, string>;
export declare const PhysiotherapyServiceDetailsSchema: z.ZodEffects<z.ZodObject<{
    conditionType: z.ZodEnum<[PhysiotherapyConditionType, ...PhysiotherapyConditionType[]]>;
    otherConditionText: z.ZodOptional<z.ZodString>;
    mobilityLevel: z.ZodEnum<[MobilityLevel, ...MobilityLevel[]]>;
    sessionGoal: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    conditionType: PhysiotherapyConditionType;
    mobilityLevel: MobilityLevel;
    otherConditionText?: string | undefined;
    sessionGoal?: string | undefined;
}, {
    conditionType: PhysiotherapyConditionType;
    mobilityLevel: MobilityLevel;
    otherConditionText?: string | undefined;
    sessionGoal?: string | undefined;
}>, {
    conditionType: PhysiotherapyConditionType;
    mobilityLevel: MobilityLevel;
    otherConditionText?: string | undefined;
    sessionGoal?: string | undefined;
}, {
    conditionType: PhysiotherapyConditionType;
    mobilityLevel: MobilityLevel;
    otherConditionText?: string | undefined;
    sessionGoal?: string | undefined;
}>;
export type PhysiotherapyServiceDetails = z.infer<typeof PhysiotherapyServiceDetailsSchema>;
