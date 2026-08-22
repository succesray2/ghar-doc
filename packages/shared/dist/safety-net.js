"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFETY_NET_QUESTIONS = exports.SafetyNetPreviewSchema = exports.SafetyNetAnswersSchema = exports.SAFETY_NET_RULE_VERSION = void 0;
exports.evaluateSafetyNet = evaluateSafetyNet;
const zod_1 = require("zod");
/** A lightweight, universal red-flag check for Nursing/Physiotherapy
 *  bookings — deliberately NOT the 20-category doctor triage engine in
 *  triage-rules.ts, which stays untouched. Any "yes" hard-blocks the
 *  booking with no acknowledge-and-proceed option; the caller redirects to
 *  the doctor-request flow instead. Bumped only if the question set changes. */
exports.SAFETY_NET_RULE_VERSION = 1;
exports.SafetyNetAnswersSchema = zod_1.z.object({
    chestPain: zod_1.z.boolean(),
    breathingDifficulty: zod_1.z.boolean(),
    severeBleeding: zod_1.z.boolean(),
    lossOfConsciousnessOrConfusion: zod_1.z.boolean(),
});
exports.SafetyNetPreviewSchema = zod_1.z.object({
    safetyCheckAnswers: exports.SafetyNetAnswersSchema,
});
exports.SAFETY_NET_QUESTIONS = [
    { id: 'chestPain', label: 'Chest pain right now' },
    { id: 'breathingDifficulty', label: 'Difficulty breathing' },
    { id: 'severeBleeding', label: 'Severe or uncontrolled bleeding' },
    { id: 'lossOfConsciousnessOrConfusion', label: 'Loss of consciousness or sudden confusion' },
];
function evaluateSafetyNet(answers) {
    return { triggered: Object.values(answers).some(Boolean) };
}
