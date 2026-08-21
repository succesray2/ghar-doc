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

export const TRIAGE_RULE_VERSION = 1;

export const TRIAGE_TAXONOMY_NOTICE =
  'This list covers common reasons people request a home visit. It is not exhaustive — if you don’t see your symptom, use "Other" below.';

export interface SymptomDef {
  id: string;
  label: string;
}

export interface SymptomCategory {
  id: string;
  label: string;
  symptoms: SymptomDef[];
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: 'general',
    label: 'General',
    symptoms: [
      { id: 'fever', label: 'Fever' },
      { id: 'chills', label: 'Chills' },
      { id: 'weakness', label: 'Weakness' },
      { id: 'fatigue', label: 'Fatigue' },
      { id: 'dizziness', label: 'Dizziness' },
      { id: 'fainting', label: 'Fainting' },
      { id: 'loss_of_appetite', label: 'Loss of appetite' },
      { id: 'weight_change', label: 'Unexplained weight change' },
    ],
  },
  {
    id: 'breathing_chest',
    label: 'Breathing / Chest',
    symptoms: [
      { id: 'difficulty_breathing', label: 'Difficulty breathing' },
      { id: 'shortness_of_breath', label: 'Shortness of breath' },
      { id: 'chest_pain', label: 'Chest pain' },
      { id: 'chest_pressure', label: 'Chest pressure / tightness' },
      { id: 'cough', label: 'Cough' },
      { id: 'wheezing', label: 'Wheezing' },
      { id: 'coughing_blood', label: 'Coughing blood' },
    ],
  },
  {
    id: 'neurological',
    label: 'Neurological',
    symptoms: [
      { id: 'severe_headache', label: 'Severe headache' },
      { id: 'sudden_weakness', label: 'Sudden weakness' },
      { id: 'numbness', label: 'Numbness' },
      { id: 'facial_weakness', label: 'Facial weakness' },
      { id: 'difficulty_speaking', label: 'Difficulty speaking' },
      { id: 'confusion', label: 'Confusion' },
      { id: 'seizure', label: 'Seizure' },
      { id: 'loss_of_consciousness', label: 'Loss of consciousness' },
      { id: 'sudden_difficulty_walking', label: 'Sudden difficulty walking' },
      { id: 'sudden_vision_problem', label: 'Sudden vision problem' },
    ],
  },
  {
    id: 'gastrointestinal',
    label: 'Gastrointestinal',
    symptoms: [
      { id: 'abdominal_pain', label: 'Abdominal pain' },
      { id: 'vomiting', label: 'Vomiting' },
      { id: 'diarrhea', label: 'Diarrhea' },
      { id: 'blood_in_stool', label: 'Blood in stool' },
      { id: 'black_stool', label: 'Black stool' },
      { id: 'severe_constipation', label: 'Severe constipation' },
      { id: 'abdominal_swelling', label: 'Abdominal swelling' },
    ],
  },
  {
    id: 'urinary',
    label: 'Urinary',
    symptoms: [
      { id: 'painful_urination', label: 'Painful urination' },
      { id: 'blood_in_urine', label: 'Blood in urine' },
      { id: 'difficulty_passing_urine', label: 'Difficulty passing urine' },
      { id: 'reduced_urine_output', label: 'Reduced urine output' },
      { id: 'urinary_incontinence', label: 'Urinary incontinence' },
    ],
  },
  {
    id: 'musculoskeletal',
    label: 'Musculoskeletal',
    symptoms: [
      { id: 'back_pain', label: 'Back pain' },
      { id: 'joint_pain', label: 'Joint pain' },
      { id: 'limb_pain', label: 'Limb pain' },
      { id: 'injury', label: 'Injury' },
      { id: 'fall', label: 'Fall' },
      { id: 'difficulty_walking', label: 'Difficulty walking' },
    ],
  },
  {
    id: 'skin_wounds',
    label: 'Skin / Wounds',
    symptoms: [
      { id: 'wound', label: 'Wound' },
      { id: 'pressure_sore', label: 'Pressure sore' },
      { id: 'swelling', label: 'Swelling' },
      { id: 'rash', label: 'Rash' },
      { id: 'redness', label: 'Redness' },
      { id: 'skin_infection', label: 'Skin infection' },
      { id: 'non_healing_wound', label: 'Non-healing wound' },
    ],
  },
  {
    id: 'elderly_functional',
    label: 'Elderly / Functional',
    symptoms: [
      { id: 'recent_fall', label: 'Recent fall' },
      { id: 'sudden_behaviour_change', label: 'Sudden change in behaviour' },
      { id: 'new_confusion', label: 'New confusion' },
      { id: 'reduced_mobility', label: 'Reduced mobility' },
      { id: 'difficulty_eating_drinking', label: 'Difficulty eating/drinking' },
      { id: 'difficulty_daily_activities', label: 'Difficulty performing daily activities' },
      { id: 'new_weakness', label: 'New weakness' },
      { id: 'caregiver_concern', label: 'Caregiver concern' },
    ],
  },
];

export const DurationOption = {
  LESS_THAN_1_HOUR: 'LESS_THAN_1_HOUR',
  ONE_TO_6_HOURS: 'ONE_TO_6_HOURS',
  SIX_TO_24_HOURS: 'SIX_TO_24_HOURS',
  ONE_TO_3_DAYS: 'ONE_TO_3_DAYS',
  FOUR_TO_7_DAYS: 'FOUR_TO_7_DAYS',
  ONE_TO_2_WEEKS: 'ONE_TO_2_WEEKS',
  MORE_THAN_2_WEEKS: 'MORE_THAN_2_WEEKS',
  RECURRENT: 'RECURRENT',
  NOT_SURE: 'NOT_SURE',
} as const;
export type DurationOption = (typeof DurationOption)[keyof typeof DurationOption];

export const DURATION_LABELS: Record<DurationOption, string> = {
  LESS_THAN_1_HOUR: 'Less than 1 hour',
  ONE_TO_6_HOURS: '1–6 hours',
  SIX_TO_24_HOURS: '6–24 hours',
  ONE_TO_3_DAYS: '1–3 days',
  FOUR_TO_7_DAYS: '4–7 days',
  ONE_TO_2_WEEKS: '1–2 weeks',
  MORE_THAN_2_WEEKS: 'More than 2 weeks',
  RECURRENT: 'Recurrent / comes and goes',
  NOT_SURE: 'Not sure',
};

export const SeverityOption = {
  MILD: 'MILD',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE',
  NOT_SURE: 'NOT_SURE',
} as const;
export type SeverityOption = (typeof SeverityOption)[keyof typeof SeverityOption];

export const SEVERITY_LABELS: Record<SeverityOption, string> = {
  MILD: 'Mild',
  MODERATE: 'Moderate',
  SEVERE: 'Severe',
  NOT_SURE: 'Not sure',
};

export interface AssociatedSignQuestion {
  id: string;
  label: string;
}

const CHEST_PAIN_SIGNS: AssociatedSignQuestion[] = [
  { id: 'difficulty_breathing', label: 'Difficulty breathing?' },
  { id: 'sweating', label: 'Sweating?' },
  { id: 'fainting', label: 'Fainting?' },
  { id: 'severe_weakness', label: 'Severe weakness?' },
  { id: 'pain_spreading_arm_jaw_back', label: 'Pain spreading to arm/jaw/back?' },
  { id: 'sudden_onset', label: 'Sudden onset?' },
  { id: 'severe_or_worsening', label: 'Severe or worsening pain?' },
];

const BREATHING_DIFFICULTY_SIGNS: AssociatedSignQuestion[] = [
  { id: 'severe_breathing_difficulty', label: 'Severe breathing difficulty?' },
  { id: 'unable_to_speak_normally', label: 'Unable to speak normally because of breathlessness?' },
  { id: 'blue_grey_lips_face', label: 'Blue/grey lips or face?' },
  { id: 'chest_pain', label: 'Chest pain?' },
  { id: 'fainting', label: 'Fainting?' },
  { id: 'confusion', label: 'Confusion?' },
  { id: 'sudden_onset', label: 'Sudden onset?' },
];

const NEUROLOGICAL_SIGNS: AssociatedSignQuestion[] = [
  { id: 'sudden_onset', label: 'Sudden onset?' },
  { id: 'facial_drooping', label: 'Facial drooping?' },
  { id: 'arm_leg_weakness', label: 'Arm/leg weakness?' },
  { id: 'difficulty_speaking', label: 'Difficulty speaking?' },
  { id: 'loss_of_consciousness', label: 'Loss of consciousness?' },
  { id: 'seizure', label: 'Seizure?' },
  { id: 'severe_sudden_headache', label: 'Severe sudden headache?' },
  { id: 'new_confusion', label: 'New confusion?' },
];

const GI_SIGNS: AssociatedSignQuestion[] = [
  { id: 'blood', label: 'Blood?' },
  { id: 'severe_abdominal_pain', label: 'Severe abdominal pain?' },
  { id: 'fainting', label: 'Fainting?' },
  { id: 'confusion', label: 'Confusion?' },
  { id: 'unable_keep_fluids_down', label: 'Unable to keep fluids down?' },
  { id: 'very_reduced_urine_output', label: 'Very reduced urine output?' },
];

const FALL_INJURY_SIGNS: AssociatedSignQuestion[] = [
  { id: 'loss_of_consciousness', label: 'Loss of consciousness?' },
  { id: 'head_injury', label: 'Head injury?' },
  { id: 'severe_pain', label: 'Severe pain?' },
  { id: 'unable_to_stand_walk', label: 'Unable to stand/walk?' },
  { id: 'bleeding', label: 'Bleeding?' },
  { id: 'blood_thinner_use', label: 'Taking a blood thinner / anticoagulant?' },
];

const NEURO_SYMPTOM_IDS = [
  'severe_headache',
  'sudden_weakness',
  'numbness',
  'facial_weakness',
  'difficulty_speaking',
  'confusion',
  'seizure',
  'loss_of_consciousness',
  'sudden_difficulty_walking',
  'sudden_vision_problem',
];

/** Only the symptoms that have follow-up questions appear here — every other
 *  selected symptom simply has none, per "only show relevant follow-up
 *  questions based on selected symptoms." */
export const ASSOCIATED_SIGN_QUESTIONS: Record<string, AssociatedSignQuestion[]> = {
  chest_pain: CHEST_PAIN_SIGNS,
  chest_pressure: CHEST_PAIN_SIGNS,
  difficulty_breathing: BREATHING_DIFFICULTY_SIGNS,
  shortness_of_breath: BREATHING_DIFFICULTY_SIGNS,
  vomiting: GI_SIGNS,
  diarrhea: GI_SIGNS,
  fall: FALL_INJURY_SIGNS,
  injury: FALL_INJURY_SIGNS,
  recent_fall: FALL_INJURY_SIGNS,
  ...Object.fromEntries(NEURO_SYMPTOM_IDS.map((id) => [id, NEUROLOGICAL_SIGNS])),
};

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

function findSymptom(answers: TriageAnswers, id: string): SymptomAnswer | undefined {
  return answers.symptoms.find((s) => s.symptomId === id);
}
function findAnySymptom(answers: TriageAnswers, ids: string[]): SymptomAnswer | undefined {
  return answers.symptoms.find((s) => ids.includes(s.symptomId));
}
function sign(symptom: SymptomAnswer | undefined, signId: string): boolean {
  return !!symptom?.associatedSigns?.[signId];
}
function anySign(answers: TriageAnswers, ids: string[], signId: string): boolean {
  return ids.some((id) => sign(findSymptom(answers, id), signId));
}
function isSevere(symptom: SymptomAnswer | undefined): boolean {
  return symptom?.severity === SeverityOption.SEVERE;
}

interface TriageRule {
  id: string;
  label: string;
  priority: 'RED' | 'ORANGE';
  test: (answers: TriageAnswers) => boolean;
}

const BREATHING_IDS = ['difficulty_breathing', 'shortness_of_breath'];
const CHEST_PAIN_IDS = ['chest_pain', 'chest_pressure'];
const FALL_INJURY_IDS = ['fall', 'injury', 'recent_fall'];
const GI_IDS = ['vomiting', 'diarrhea'];

// Built directly from the red-flag examples specified in the product brief
// (see the top-of-file notice — not independently clinically authored).
const RED_FLAG_RULES: TriageRule[] = [
  {
    id: 'severe_breathing_difficulty',
    label: 'Severe breathing difficulty reported',
    priority: 'RED',
    test: (a) => {
      const s = findAnySymptom(a, BREATHING_IDS);
      return (
        !!s &&
        (isSevere(s) ||
          anySign(a, BREATHING_IDS, 'severe_breathing_difficulty') ||
          anySign(a, BREATHING_IDS, 'unable_to_speak_normally') ||
          anySign(a, BREATHING_IDS, 'blue_grey_lips_face'))
      );
    },
  },
  {
    id: 'possible_cardiac_chest_pain',
    label: 'Chest pain with cardiac-pattern warning signs',
    priority: 'RED',
    test: (a) => {
      const s = findAnySymptom(a, CHEST_PAIN_IDS);
      return (
        !!s &&
        (isSevere(s) ||
          anySign(a, CHEST_PAIN_IDS, 'pain_spreading_arm_jaw_back') ||
          anySign(a, CHEST_PAIN_IDS, 'sweating') ||
          anySign(a, CHEST_PAIN_IDS, 'fainting') ||
          anySign(a, CHEST_PAIN_IDS, 'severe_weakness') ||
          anySign(a, CHEST_PAIN_IDS, 'difficulty_breathing'))
      );
    },
  },
  {
    id: 'loss_of_consciousness',
    label: 'Loss of consciousness reported or associated',
    priority: 'RED',
    test: (a) =>
      !!findSymptom(a, 'loss_of_consciousness') ||
      anySign(a, NEURO_SYMPTOM_IDS, 'loss_of_consciousness') ||
      anySign(a, FALL_INJURY_IDS, 'loss_of_consciousness') ||
      anySign(a, GI_IDS, 'fainting'),
  },
  {
    id: 'new_seizure',
    label: 'Seizure reported',
    priority: 'RED',
    test: (a) => !!findSymptom(a, 'seizure') || anySign(a, NEURO_SYMPTOM_IDS, 'seizure'),
  },
  {
    id: 'sudden_facial_or_limb_weakness',
    label: 'Sudden facial or one-sided weakness',
    priority: 'RED',
    test: (a) =>
      !!findSymptom(a, 'facial_weakness') ||
      anySign(a, NEURO_SYMPTOM_IDS, 'facial_drooping') ||
      (!!findSymptom(a, 'sudden_weakness') && anySign(a, NEURO_SYMPTOM_IDS, 'arm_leg_weakness')),
  },
  {
    id: 'sudden_difficulty_speaking',
    label: 'Sudden difficulty speaking',
    priority: 'RED',
    test: (a) => !!findSymptom(a, 'difficulty_speaking') || anySign(a, NEURO_SYMPTOM_IDS, 'difficulty_speaking'),
  },
  {
    id: 'severe_sudden_confusion',
    label: 'Severe or sudden confusion',
    priority: 'RED',
    test: (a) => {
      const c = findSymptom(a, 'confusion');
      return (
        (!!c && (isSevere(c) || c.duration === DurationOption.LESS_THAN_1_HOUR || c.duration === DurationOption.ONE_TO_6_HOURS)) ||
        anySign(a, NEURO_SYMPTOM_IDS, 'new_confusion')
      );
    },
  },
  {
    id: 'major_bleeding',
    label: 'Possible major bleeding',
    priority: 'RED',
    test: (a) =>
      !!findSymptom(a, 'coughing_blood') ||
      anySign(a, FALL_INJURY_IDS, 'bleeding') ||
      isSevere(findSymptom(a, 'blood_in_stool')) ||
      isSevere(findSymptom(a, 'black_stool')),
  },
  {
    id: 'severe_headache_with_neuro_signs',
    label: 'Severe headache with neurological warning signs',
    priority: 'RED',
    test: (a) => {
      const h = findSymptom(a, 'severe_headache');
      if (!h) return false;
      return (
        sign(h, 'severe_sudden_headache') ||
        sign(h, 'facial_drooping') ||
        sign(h, 'arm_leg_weakness') ||
        sign(h, 'difficulty_speaking') ||
        sign(h, 'loss_of_consciousness') ||
        sign(h, 'seizure')
      );
    },
  },
  {
    id: 'major_trauma',
    label: 'Major trauma / fall with a warning sign',
    priority: 'RED',
    test: (a) =>
      anySign(a, FALL_INJURY_IDS, 'head_injury') ||
      (anySign(a, FALL_INJURY_IDS, 'severe_pain') && anySign(a, FALL_INJURY_IDS, 'unable_to_stand_walk')) ||
      (anySign(a, FALL_INJURY_IDS, 'blood_thinner_use') && anySign(a, FALL_INJURY_IDS, 'bleeding')),
  },
];

const ORANGE_FLAG_RULES: TriageRule[] = [
  {
    id: 'elderly_functional_decline',
    label: 'Elderly functional-decline or caregiver concern signal',
    priority: 'ORANGE',
    test: (a) =>
      ['sudden_behaviour_change', 'new_confusion', 'new_weakness', 'caregiver_concern', 'reduced_mobility', 'difficulty_eating_drinking'].some(
        (id) => !!findSymptom(a, id),
      ),
  },
  {
    id: 'gi_dehydration_risk',
    label: 'Possible dehydration from vomiting/diarrhea',
    priority: 'ORANGE',
    test: (a) => anySign(a, GI_IDS, 'unable_keep_fluids_down') || anySign(a, GI_IDS, 'very_reduced_urine_output'),
  },
  {
    id: 'reduced_urine_output',
    label: 'Reduced urine output',
    priority: 'ORANGE',
    test: (a) => !!findSymptom(a, 'reduced_urine_output'),
  },
  {
    id: 'any_severe_symptom',
    label: 'A selected symptom marked severe',
    priority: 'ORANGE',
    // Severity alone must never drive a RED/emergency classification (per the
    // brief), but it's a reasonable, explicit ORANGE prioritization signal.
    test: (a) => a.symptoms.some((s) => s.severity === SeverityOption.SEVERE),
  },
];

/** Authoritative classification. Called server-side on every visit creation
 *  (never trusts a client-supplied priority) and, identically, client-side
 *  for instant feedback during the review step. */
export function classifyTriage(answers: TriageAnswers): TriageResult {
  const redMatches = RED_FLAG_RULES.filter((r) => r.test(answers));
  if (redMatches.length > 0) {
    return {
      priority: TriagePriority.RED,
      matchedRedFlags: redMatches.map((r) => ({ ruleId: r.id, label: r.label })),
    };
  }

  const orangeMatches = ORANGE_FLAG_RULES.filter((r) => r.test(answers));
  if (orangeMatches.length > 0) {
    return {
      priority: TriagePriority.ORANGE,
      matchedRedFlags: orangeMatches.map((r) => ({ ruleId: r.id, label: r.label })),
    };
  }

  return { priority: TriagePriority.GREEN, matchedRedFlags: [] };
}

export const TRIAGE_MESSAGES: Record<TriagePriority, string> = {
  RED: 'Your answers may indicate a condition that needs urgent medical assessment. A routine GharDoc home visit may not be appropriate right now.',
  ORANGE: 'Based on your answers, this request will be marked for priority assessment.',
  GREEN: 'This looks appropriate for a routine home doctor visit.',
};
