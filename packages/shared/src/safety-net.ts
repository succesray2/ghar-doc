import { z } from 'zod';

/** A lightweight, universal red-flag check for Nursing/Physiotherapy
 *  bookings — deliberately NOT the 20-category doctor triage engine in
 *  triage-rules.ts, which stays untouched. Any "yes" hard-blocks the
 *  booking with no acknowledge-and-proceed option; the caller redirects to
 *  the doctor-request flow instead. Bumped only if the question set changes. */
export const SAFETY_NET_RULE_VERSION = 1;

export const SafetyNetAnswersSchema = z.object({
  chestPain: z.boolean(),
  breathingDifficulty: z.boolean(),
  severeBleeding: z.boolean(),
  lossOfConsciousnessOrConfusion: z.boolean(),
});
export type SafetyNetAnswers = z.infer<typeof SafetyNetAnswersSchema>;

export const SafetyNetPreviewSchema = z.object({
  safetyCheckAnswers: SafetyNetAnswersSchema,
});
export type SafetyNetPreviewInput = z.infer<typeof SafetyNetPreviewSchema>;

export const SAFETY_NET_QUESTIONS: { id: keyof SafetyNetAnswers; label: string }[] = [
  { id: 'chestPain', label: 'Chest pain right now' },
  { id: 'breathingDifficulty', label: 'Difficulty breathing' },
  { id: 'severeBleeding', label: 'Severe or uncontrolled bleeding' },
  { id: 'lossOfConsciousnessOrConfusion', label: 'Loss of consciousness or sudden confusion' },
];

export interface SafetyNetResult {
  triggered: boolean;
}

export function evaluateSafetyNet(answers: SafetyNetAnswers): SafetyNetResult {
  return { triggered: Object.values(answers).some(Boolean) };
}
