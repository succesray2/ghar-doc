import { TriagePriority } from './enums';
/**
 * ============================================================================
 * NOT A DIAGNOSTIC TOOL. NOT CLINICALLY VALIDATED.
 * ============================================================================
 * This file classifies a patient's structured symptom answers into a
 * dispatch-priority signal (GREEN/ORANGE/RED) used ONLY to decide whether a
 * routine home-visit booking should proceed, be prioritized, or be paused
 * with an urgent-care warning. It never produces a diagnosis, and the
 * classification must never be shown to a patient as medical reassurance
 * ("you are fine") or as a diagnostic statement ("you are having X").
 *
 * The symptom taxonomy, associated-sign questions, and red-flag rules below
 * were built directly from a product brief's own specification, not derived
 * from independent clinical review. This ruleset REQUIRES review by a
 * qualified clinician before it is used to affect any real patient's care.
 * That review has not happened yet — do not remove this notice until it has.
 *
 * The classification is computed authoritatively on the server
 * (VisitsService.previewTriage / .create), never trusted from the client —
 * this module is shared so the exact same logic can also run client-side
 * for instant UI feedback, but the server's own computation is what's ever
 * persisted or acted on.
 * ============================================================================
 */
export declare const TRIAGE_RULE_VERSION = 1;
export declare const TRIAGE_TAXONOMY_NOTICE = "This list covers common reasons people request a home visit. It is not exhaustive \u2014 if you don\u2019t see your symptom, use \"Other\" below.";
export interface SymptomDef {
    id: string;
    label: string;
}
export interface SymptomCategory {
    id: string;
    label: string;
    symptoms: SymptomDef[];
}
export declare const SYMPTOM_CATEGORIES: SymptomCategory[];
export declare const DurationOption: {
    readonly LESS_THAN_1_HOUR: "LESS_THAN_1_HOUR";
    readonly ONE_TO_6_HOURS: "ONE_TO_6_HOURS";
    readonly SIX_TO_24_HOURS: "SIX_TO_24_HOURS";
    readonly ONE_TO_3_DAYS: "ONE_TO_3_DAYS";
    readonly FOUR_TO_7_DAYS: "FOUR_TO_7_DAYS";
    readonly ONE_TO_2_WEEKS: "ONE_TO_2_WEEKS";
    readonly MORE_THAN_2_WEEKS: "MORE_THAN_2_WEEKS";
    readonly RECURRENT: "RECURRENT";
    readonly NOT_SURE: "NOT_SURE";
};
export type DurationOption = (typeof DurationOption)[keyof typeof DurationOption];
export declare const DURATION_LABELS: Record<DurationOption, string>;
export declare const SeverityOption: {
    readonly MILD: "MILD";
    readonly MODERATE: "MODERATE";
    readonly SEVERE: "SEVERE";
    readonly NOT_SURE: "NOT_SURE";
};
export type SeverityOption = (typeof SeverityOption)[keyof typeof SeverityOption];
export declare const SEVERITY_LABELS: Record<SeverityOption, string>;
export interface AssociatedSignQuestion {
    id: string;
    label: string;
}
/** Only the symptoms that have follow-up questions appear here — every other
 *  selected symptom simply has none, per "only show relevant follow-up
 *  questions based on selected symptoms." */
export declare const ASSOCIATED_SIGN_QUESTIONS: Record<string, AssociatedSignQuestion[]>;
export interface SymptomAnswer {
    symptomId: string;
    duration?: DurationOption;
    startedAt?: string;
    severity?: SeverityOption;
    associatedSigns?: Record<string, boolean>;
}
export interface TriageAnswers {
    symptoms: SymptomAnswer[];
    otherSymptomText?: string;
}
export interface MatchedRedFlag {
    ruleId: string;
    label: string;
}
export interface TriageResult {
    priority: TriagePriority;
    matchedRedFlags: MatchedRedFlag[];
}
/** Authoritative classification. Called server-side on every visit creation
 *  (never trusts a client-supplied priority) and, identically, client-side
 *  for instant feedback during the review step. */
export declare function classifyTriage(answers: TriageAnswers): TriageResult;
export declare const TRIAGE_MESSAGES: Record<TriagePriority, string>;
