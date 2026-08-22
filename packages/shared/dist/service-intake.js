"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysiotherapyServiceDetailsSchema = exports.MOBILITY_LEVEL_LABELS = exports.MobilityLevel = exports.PHYSIOTHERAPY_CONDITION_LABELS = exports.PhysiotherapyConditionType = exports.NursingServiceDetailsSchema = exports.NURSING_SERVICE_LABELS = exports.NursingServiceType = void 0;
const zod_1 = require("zod");
// Structured intake for Nursing/Physiotherapy bookings, stored as
// Visit.serviceDetails (JSON) — mirrors VisitTriage.answers's proven
// structured-but-flexible pattern rather than adding sparse nullable
// columns to the shared Visit table. Kept in its own module (not enums.ts),
// same precedent as triage-rules.ts keeping its own option enums local.
exports.NursingServiceType = {
    WOUND_CARE: 'WOUND_CARE',
    INJECTION: 'INJECTION',
    IV_DRIP: 'IV_DRIP',
    OTHER: 'OTHER',
};
exports.NURSING_SERVICE_LABELS = {
    WOUND_CARE: 'Wound care',
    INJECTION: 'Injection',
    IV_DRIP: 'IV drip',
    OTHER: 'Other',
};
const NURSING_SERVICE_VALUES = Object.values(exports.NursingServiceType);
exports.NursingServiceDetailsSchema = zod_1.z
    .object({
    nursingServiceType: zod_1.z.enum(NURSING_SERVICE_VALUES),
    otherServiceText: zod_1.z.string().optional(),
    careNotes: zod_1.z.string().optional(),
})
    .superRefine((data, ctx) => {
    if (data.nursingServiceType === 'OTHER' && !data.otherServiceText) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['otherServiceText'], message: 'Required when service type is Other' });
    }
});
exports.PhysiotherapyConditionType = {
    POST_SURGERY: 'POST_SURGERY',
    BACK_PAIN: 'BACK_PAIN',
    STROKE_RECOVERY: 'STROKE_RECOVERY',
    SPORTS_INJURY: 'SPORTS_INJURY',
    CHRONIC_PAIN: 'CHRONIC_PAIN',
    OTHER: 'OTHER',
};
exports.PHYSIOTHERAPY_CONDITION_LABELS = {
    POST_SURGERY: 'Post-surgery recovery',
    BACK_PAIN: 'Back pain',
    STROKE_RECOVERY: 'Stroke recovery',
    SPORTS_INJURY: 'Sports injury',
    CHRONIC_PAIN: 'Chronic pain',
    OTHER: 'Other',
};
const PHYSIO_CONDITION_VALUES = Object.values(exports.PhysiotherapyConditionType);
exports.MobilityLevel = {
    INDEPENDENT: 'INDEPENDENT',
    NEEDS_ASSISTANCE: 'NEEDS_ASSISTANCE',
    WHEELCHAIR: 'WHEELCHAIR',
    BEDBOUND: 'BEDBOUND',
};
exports.MOBILITY_LEVEL_LABELS = {
    INDEPENDENT: 'Independent',
    NEEDS_ASSISTANCE: 'Needs assistance',
    WHEELCHAIR: 'Uses a wheelchair',
    BEDBOUND: 'Bedbound',
};
const MOBILITY_LEVEL_VALUES = Object.values(exports.MobilityLevel);
exports.PhysiotherapyServiceDetailsSchema = zod_1.z
    .object({
    conditionType: zod_1.z.enum(PHYSIO_CONDITION_VALUES),
    otherConditionText: zod_1.z.string().optional(),
    mobilityLevel: zod_1.z.enum(MOBILITY_LEVEL_VALUES),
    sessionGoal: zod_1.z.string().optional(),
})
    .superRefine((data, ctx) => {
    if (data.conditionType === 'OTHER' && !data.otherConditionText) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['otherConditionText'], message: 'Required when condition is Other' });
    }
});
