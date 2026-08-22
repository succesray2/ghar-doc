import { z } from 'zod';

// Structured intake for Nursing/Physiotherapy bookings, stored as
// Visit.serviceDetails (JSON) — mirrors VisitTriage.answers's proven
// structured-but-flexible pattern rather than adding sparse nullable
// columns to the shared Visit table. Kept in its own module (not enums.ts),
// same precedent as triage-rules.ts keeping its own option enums local.

export const NursingServiceType = {
  WOUND_CARE: 'WOUND_CARE',
  INJECTION: 'INJECTION',
  IV_DRIP: 'IV_DRIP',
  OTHER: 'OTHER',
} as const;
export type NursingServiceType = (typeof NursingServiceType)[keyof typeof NursingServiceType];

export const NURSING_SERVICE_LABELS: Record<NursingServiceType, string> = {
  WOUND_CARE: 'Wound care',
  INJECTION: 'Injection',
  IV_DRIP: 'IV drip',
  OTHER: 'Other',
};

const NURSING_SERVICE_VALUES = Object.values(NursingServiceType) as [NursingServiceType, ...NursingServiceType[]];

export const NursingServiceDetailsSchema = z
  .object({
    nursingServiceType: z.enum(NURSING_SERVICE_VALUES),
    otherServiceText: z.string().optional(),
    careNotes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.nursingServiceType === 'OTHER' && !data.otherServiceText) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherServiceText'], message: 'Required when service type is Other' });
    }
  });
export type NursingServiceDetails = z.infer<typeof NursingServiceDetailsSchema>;

export const PhysiotherapyConditionType = {
  POST_SURGERY: 'POST_SURGERY',
  BACK_PAIN: 'BACK_PAIN',
  STROKE_RECOVERY: 'STROKE_RECOVERY',
  SPORTS_INJURY: 'SPORTS_INJURY',
  CHRONIC_PAIN: 'CHRONIC_PAIN',
  OTHER: 'OTHER',
} as const;
export type PhysiotherapyConditionType = (typeof PhysiotherapyConditionType)[keyof typeof PhysiotherapyConditionType];

export const PHYSIOTHERAPY_CONDITION_LABELS: Record<PhysiotherapyConditionType, string> = {
  POST_SURGERY: 'Post-surgery recovery',
  BACK_PAIN: 'Back pain',
  STROKE_RECOVERY: 'Stroke recovery',
  SPORTS_INJURY: 'Sports injury',
  CHRONIC_PAIN: 'Chronic pain',
  OTHER: 'Other',
};

const PHYSIO_CONDITION_VALUES = Object.values(PhysiotherapyConditionType) as [
  PhysiotherapyConditionType,
  ...PhysiotherapyConditionType[],
];

export const MobilityLevel = {
  INDEPENDENT: 'INDEPENDENT',
  NEEDS_ASSISTANCE: 'NEEDS_ASSISTANCE',
  WHEELCHAIR: 'WHEELCHAIR',
  BEDBOUND: 'BEDBOUND',
} as const;
export type MobilityLevel = (typeof MobilityLevel)[keyof typeof MobilityLevel];

export const MOBILITY_LEVEL_LABELS: Record<MobilityLevel, string> = {
  INDEPENDENT: 'Independent',
  NEEDS_ASSISTANCE: 'Needs assistance',
  WHEELCHAIR: 'Uses a wheelchair',
  BEDBOUND: 'Bedbound',
};

const MOBILITY_LEVEL_VALUES = Object.values(MobilityLevel) as [MobilityLevel, ...MobilityLevel[]];

export const PhysiotherapyServiceDetailsSchema = z
  .object({
    conditionType: z.enum(PHYSIO_CONDITION_VALUES),
    otherConditionText: z.string().optional(),
    mobilityLevel: z.enum(MOBILITY_LEVEL_VALUES),
    sessionGoal: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.conditionType === 'OTHER' && !data.otherConditionText) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherConditionText'], message: 'Required when condition is Other' });
    }
  });
export type PhysiotherapyServiceDetails = z.infer<typeof PhysiotherapyServiceDetailsSchema>;
