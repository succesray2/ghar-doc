import { z } from 'zod';
/** A lightweight, universal red-flag check for Nursing/Physiotherapy
 *  bookings — deliberately NOT the 20-category doctor triage engine in
 *  triage-rules.ts, which stays untouched. Any "yes" hard-blocks the
 *  booking with no acknowledge-and-proceed option; the caller redirects to
 *  the doctor-request flow instead. Bumped only if the question set changes. */
export declare const SAFETY_NET_RULE_VERSION = 1;
export declare const SafetyNetAnswersSchema: z.ZodObject<{
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
}>;
export type SafetyNetAnswers = z.infer<typeof SafetyNetAnswersSchema>;
export declare const SafetyNetPreviewSchema: z.ZodObject<{
    safetyCheckAnswers: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    safetyCheckAnswers: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    };
}, {
    safetyCheckAnswers: {
        chestPain: boolean;
        breathingDifficulty: boolean;
        severeBleeding: boolean;
        lossOfConsciousnessOrConfusion: boolean;
    };
}>;
export type SafetyNetPreviewInput = z.infer<typeof SafetyNetPreviewSchema>;
export declare const SAFETY_NET_QUESTIONS: {
    id: keyof SafetyNetAnswers;
    label: string;
}[];
export interface SafetyNetResult {
    triggered: boolean;
}
export declare function evaluateSafetyNet(answers: SafetyNetAnswers): SafetyNetResult;
