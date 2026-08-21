"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIAGE_MESSAGES = exports.ASSOCIATED_SIGN_QUESTIONS = exports.WOMENS_HEALTH_BLEEDING_IDS = exports.ELDERLY_IDS = exports.FEVER_IDS = exports.BP_EXTREME_IDS = exports.DIABETES_EXTREME_IDS = exports.DIABETES_CATEGORY_IDS = exports.ABDOMINAL_PAIN_IDS = exports.GI_IDS = exports.FALL_INJURY_IDS = exports.CHEST_PAIN_IDS = exports.BREATHING_IDS = exports.BODY_REGION_OPTIONS = exports.SEVERITY_LABELS = exports.SeverityOption = exports.DURATION_LABELS = exports.DurationOption = exports.SYMPTOM_CATEGORIES = exports.TRIAGE_TAXONOMY_NOTICE = exports.TRIAGE_RULE_VERSION = void 0;
exports.classifyTriage = classifyTriage;
const enums_1 = require("./enums");
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
 * were built directly from product briefs' own specifications, not derived
 * from independent clinical review. This ruleset REQUIRES review by a
 * qualified clinician before it is used to affect any real patient's care.
 * That review has not happened yet — do not remove this notice until it has.
 *
 * The classification is computed authoritatively on the server
 * (VisitsService.previewTriage / .create), never trusted from the client —
 * this module is shared so the exact same logic can also run client-side
 * for instant UI feedback, but the server's own computation is what's ever
 * persisted or acted on.
 *
 * Deliberately NOT built here: a self-harm/psychiatric-crisis detection
 * workflow. A later brief asked for this explicitly to be "routed through a
 * separately reviewed safety workflow" before it exists — that's a distinct
 * clinical/legal review this file can't substitute for. Mental/Behavioural
 * symptoms are selectable like any other category and flow through the same
 * generic severity escalation, nothing crisis-specific is added.
 * ============================================================================
 */
exports.TRIAGE_RULE_VERSION = 2;
exports.TRIAGE_TAXONOMY_NOTICE = 'This list covers common reasons people request a home visit. It is not exhaustive — if you don’t see your symptom, use "Other" below.';
exports.SYMPTOM_CATEGORIES = [
    {
        id: 'general',
        label: 'General / Whole Body',
        icon: '🩺',
        symptoms: [
            { id: 'fever', label: 'Fever' },
            { id: 'chills', label: 'Chills' },
            { id: 'feeling_unusually_cold', label: 'Feeling unusually cold' },
            { id: 'weakness', label: 'Weakness', searchTerms: ['weak'] },
            { id: 'generalized_weakness', label: 'Generalized weakness', searchTerms: ['weak'] },
            { id: 'extreme_tiredness', label: 'Extreme tiredness' },
            { id: 'fatigue', label: 'Fatigue' },
            { id: 'dizziness', label: 'Dizziness' },
            { id: 'light_headedness', label: 'Light-headedness' },
            { id: 'fainting', label: 'Fainting' },
            { id: 'feeling_faint', label: 'Feeling faint' },
            { id: 'loss_of_appetite', label: 'Loss of appetite' },
            { id: 'excessive_thirst', label: 'Excessive thirst' },
            { id: 'excessive_sweating', label: 'Excessive sweating' },
            { id: 'night_sweats', label: 'Night sweats' },
            { id: 'unexplained_weight_loss', label: 'Unexplained weight loss' },
            { id: 'unexplained_weight_gain', label: 'Unexplained weight gain' },
            { id: 'swelling_legs', label: 'Swelling of legs', searchTerms: ['leg swelling'] },
            { id: 'swelling_feet', label: 'Swelling of feet' },
            { id: 'swelling_face', label: 'Swelling of face' },
            { id: 'reduced_activity', label: 'Reduced activity' },
            { id: 'sudden_deterioration', label: 'Sudden deterioration' },
            { id: 'feeling_worse_than_usual', label: 'Feeling significantly worse than usual' },
            { id: 'recurrent_symptoms', label: 'Recurrent symptoms' },
            { id: 'unable_daily_activities', label: 'Unable to perform usual daily activities' },
            { id: 'sudden_decline_from_usual', label: 'Sudden decline from usual condition' },
            { id: 'new_difficulty_caring_self', label: 'New difficulty caring for self' },
            { id: 'new_difficulty_walking', label: 'New difficulty walking', searchTerms: ['walking'] },
            { id: 'new_dependence_caregiver', label: 'New dependence on caregiver' },
            { id: 'general_new_weakness', label: 'New weakness', searchTerms: ['weak'] },
            { id: 'general_new_confusion', label: 'New confusion' },
            { id: 'reduced_eating_drinking', label: 'Reduced eating/drinking' },
        ],
    },
    {
        id: 'heart_chest',
        label: 'Heart & Chest',
        icon: '🫀',
        symptoms: [
            { id: 'chest_pain', label: 'Chest pain', searchTerms: ['pain'] },
            { id: 'chest_pressure', label: 'Chest pressure' },
            { id: 'chest_tightness', label: 'Chest tightness' },
            { id: 'chest_discomfort', label: 'Chest discomfort' },
            { id: 'palpitations', label: 'Palpitations' },
            { id: 'fast_heartbeat', label: 'Fast heartbeat' },
            { id: 'irregular_heartbeat', label: 'Irregular heartbeat' },
            { id: 'slow_heartbeat_noticed', label: 'Slow heartbeat noticed' },
            { id: 'chest_heaviness', label: 'Chest heaviness' },
            { id: 'pain_spreading_arm', label: 'Pain spreading to arm' },
            { id: 'pain_spreading_shoulder', label: 'Pain spreading to shoulder' },
            { id: 'pain_spreading_jaw', label: 'Pain spreading to jaw' },
            { id: 'pain_spreading_back', label: 'Pain spreading to back' },
            { id: 'sweating_with_chest_discomfort', label: 'Sweating with chest discomfort' },
            { id: 'breathlessness_with_chest_discomfort', label: 'Breathlessness with chest discomfort', searchTerms: ['breath'] },
            { id: 'fainting_with_chest_symptoms', label: 'Fainting with chest symptoms' },
        ],
    },
    {
        id: 'breathing_lungs',
        label: 'Breathing / Lungs',
        icon: '🫁',
        symptoms: [
            { id: 'difficulty_breathing', label: 'Difficulty breathing', searchTerms: ['breath'] },
            { id: 'shortness_of_breath', label: 'Shortness of breath', searchTerms: ['breath'] },
            { id: 'breathlessness', label: 'Breathlessness', searchTerms: ['breath'] },
            { id: 'breathing_faster_than_usual', label: 'Breathing faster than usual', searchTerms: ['breath'] },
            { id: 'wheezing', label: 'Wheezing' },
            { id: 'noisy_breathing', label: 'Noisy breathing', searchTerms: ['breath'] },
            { id: 'cough', label: 'Cough' },
            { id: 'dry_cough', label: 'Dry cough' },
            { id: 'cough_with_mucus', label: 'Cough with mucus/phlegm' },
            { id: 'coughing_blood', label: 'Cough with blood' },
            { id: 'chest_congestion', label: 'Chest congestion' },
            { id: 'lung_chest_tightness', label: 'Chest tightness' },
            { id: 'difficulty_breathing_lying_down', label: 'Difficulty breathing while lying down', searchTerms: ['breath'] },
            { id: 'waking_up_breathless', label: 'Waking up breathless', searchTerms: ['breath'] },
            { id: 'new_breathing_difficulty', label: 'New breathing difficulty', searchTerms: ['breath'] },
            { id: 'worsening_breathing_difficulty', label: 'Worsening breathing difficulty', searchTerms: ['breath'] },
            { id: 'blue_grey_lips_face', label: 'Blue/grey lips or face' },
        ],
    },
    {
        id: 'brain_nerves',
        label: 'Brain & Nerves',
        icon: '🧠',
        symptoms: [
            { id: 'headache', label: 'Headache' },
            { id: 'sudden_severe_headache', label: 'Sudden severe headache' },
            { id: 'new_severe_headache', label: 'New severe headache' },
            { id: 'neuro_dizziness', label: 'Dizziness' },
            { id: 'vertigo', label: 'Vertigo' },
            { id: 'neuro_fainting', label: 'Fainting' },
            { id: 'loss_of_consciousness', label: 'Loss of consciousness' },
            { id: 'confusion', label: 'Confusion' },
            { id: 'sudden_confusion', label: 'Sudden confusion' },
            { id: 'drowsiness', label: 'Drowsiness' },
            { id: 'unusual_sleepiness', label: 'Unusual sleepiness' },
            { id: 'difficulty_speaking', label: 'Difficulty speaking' },
            { id: 'slurred_speech', label: 'Slurred speech' },
            { id: 'difficulty_understanding_speech', label: 'Difficulty understanding speech' },
            { id: 'facial_weakness', label: 'Facial weakness', searchTerms: ['weak'] },
            { id: 'facial_drooping', label: 'Facial drooping' },
            { id: 'arm_weakness', label: 'Arm weakness', searchTerms: ['weak'] },
            { id: 'leg_weakness', label: 'Leg weakness', searchTerms: ['weak'] },
            { id: 'one_sided_weakness', label: 'One-sided weakness', searchTerms: ['weak'] },
            { id: 'numbness', label: 'Numbness' },
            { id: 'one_sided_numbness', label: 'One-sided numbness' },
            { id: 'tingling', label: 'Tingling' },
            { id: 'loss_of_balance', label: 'Loss of balance' },
            { id: 'sudden_difficulty_walking', label: 'Sudden difficulty walking', searchTerms: ['walking'] },
            { id: 'vision_loss', label: 'Vision loss' },
            { id: 'blurred_vision', label: 'Blurred vision' },
            { id: 'double_vision', label: 'Double vision' },
            { id: 'seizure', label: 'Seizure' },
            { id: 'tremors', label: 'Tremors' },
            { id: 'new_change_in_behaviour', label: 'New change in behaviour' },
            { id: 'memory_disturbance', label: 'Memory disturbance' },
        ],
    },
    {
        id: 'eyes_vision',
        label: 'Eyes / Vision',
        icon: '👁️',
        symptoms: [
            { id: 'eyes_blurred_vision', label: 'Blurred vision' },
            { id: 'sudden_vision_loss', label: 'Sudden vision loss' },
            { id: 'reduced_vision', label: 'Reduced vision' },
            { id: 'eyes_double_vision', label: 'Double vision' },
            { id: 'eye_pain', label: 'Eye pain' },
            { id: 'red_eye', label: 'Red eye' },
            { id: 'eye_swelling', label: 'Eye swelling' },
            { id: 'discharge_from_eye', label: 'Discharge from eye' },
            { id: 'foreign_body_sensation', label: 'Foreign body sensation' },
            { id: 'flashes_of_light', label: 'Flashes of light' },
            { id: 'new_floaters', label: 'New floaters' },
        ],
    },
    {
        id: 'ent',
        label: 'Ear / Nose / Throat',
        icon: '👂',
        symptoms: [
            { id: 'ear_pain', label: 'Ear pain' },
            { id: 'reduced_hearing', label: 'Reduced hearing' },
            { id: 'sudden_hearing_loss', label: 'Sudden hearing loss' },
            { id: 'ear_discharge', label: 'Ear discharge' },
            { id: 'ringing_in_ears', label: 'Ringing in ears' },
            { id: 'nasal_blockage', label: 'Nasal blockage' },
            { id: 'runny_nose', label: 'Runny nose' },
            { id: 'nose_bleeding', label: 'Nose bleeding' },
            { id: 'facial_pain', label: 'Facial pain' },
            { id: 'sinus_pressure', label: 'Sinus pressure' },
            { id: 'sore_throat', label: 'Sore throat' },
            { id: 'ent_difficulty_swallowing', label: 'Difficulty swallowing' },
            { id: 'painful_swallowing', label: 'Painful swallowing' },
            { id: 'hoarseness', label: 'Hoarseness' },
            { id: 'voice_change', label: 'Voice change' },
            { id: 'swelling_of_throat', label: 'Swelling of throat' },
        ],
    },
    {
        id: 'mouth_dental',
        label: 'Mouth / Dental',
        icon: '🦷',
        symptoms: [
            { id: 'tooth_pain', label: 'Tooth pain' },
            { id: 'gum_swelling', label: 'Gum swelling' },
            { id: 'mouth_ulcer', label: 'Mouth ulcer' },
            { id: 'mouth_pain', label: 'Mouth pain' },
            { id: 'difficulty_opening_mouth', label: 'Difficulty opening mouth' },
            { id: 'dental_difficulty_swallowing', label: 'Difficulty swallowing' },
            { id: 'excess_saliva', label: 'Excess saliva' },
            { id: 'bleeding_from_mouth', label: 'Bleeding from mouth' },
        ],
    },
    {
        id: 'stomach_abdomen',
        label: 'Stomach / Abdomen',
        icon: '🤢',
        symptoms: [
            { id: 'abdominal_pain', label: 'Abdominal pain', searchTerms: ['pain'] },
            { id: 'upper_abdominal_pain', label: 'Upper abdominal pain', searchTerms: ['pain'] },
            { id: 'lower_abdominal_pain', label: 'Lower abdominal pain', searchTerms: ['pain'] },
            { id: 'right_abdominal_pain', label: 'Right-sided abdominal pain', searchTerms: ['pain'] },
            { id: 'left_abdominal_pain', label: 'Left-sided abdominal pain', searchTerms: ['pain'] },
            { id: 'abdominal_swelling', label: 'Abdominal swelling' },
            { id: 'abdominal_bloating', label: 'Abdominal bloating' },
            { id: 'nausea', label: 'Nausea' },
            { id: 'vomiting', label: 'Vomiting' },
            { id: 'repeated_vomiting', label: 'Repeated vomiting' },
            { id: 'vomiting_blood', label: 'Vomiting blood' },
            { id: 'diarrhea', label: 'Diarrhea' },
            { id: 'constipation', label: 'Constipation' },
            { id: 'severe_constipation', label: 'Severe constipation' },
            { id: 'blood_in_stool', label: 'Blood in stool' },
            { id: 'black_stool', label: 'Black stool' },
            { id: 'gi_loss_of_appetite', label: 'Loss of appetite' },
            { id: 'difficulty_eating', label: 'Difficulty eating' },
            { id: 'indigestion', label: 'Indigestion' },
            { id: 'heartburn', label: 'Heartburn' },
            { id: 'severe_abdominal_cramps', label: 'Severe abdominal cramps', searchTerms: ['pain'] },
        ],
    },
    {
        id: 'urinary_kidney',
        label: 'Urinary / Kidney',
        icon: '💧',
        symptoms: [
            { id: 'painful_urination', label: 'Painful urination' },
            { id: 'burning_urination', label: 'Burning urination' },
            { id: 'frequent_urination', label: 'Frequent urination' },
            { id: 'urgency_to_urinate', label: 'Urgency to urinate' },
            { id: 'difficulty_passing_urine', label: 'Difficulty passing urine' },
            { id: 'unable_to_pass_urine', label: 'Unable to pass urine' },
            { id: 'blood_in_urine', label: 'Blood in urine' },
            { id: 'reduced_urine_output', label: 'Reduced urine output' },
            { id: 'increased_urine_output', label: 'Increased urine output' },
            { id: 'urine_leakage', label: 'Urine leakage' },
            { id: 'lower_abdominal_discomfort', label: 'Lower abdominal discomfort' },
            { id: 'back_flank_pain', label: 'Back/flank pain', searchTerms: ['pain'] },
        ],
    },
    {
        id: 'musculoskeletal',
        label: 'Muscle / Bone / Joint',
        icon: '🦴',
        symptoms: [
            { id: 'back_pain', label: 'Back pain', searchTerms: ['pain'] },
            { id: 'neck_pain', label: 'Neck pain', searchTerms: ['pain'] },
            { id: 'shoulder_pain', label: 'Shoulder pain', searchTerms: ['pain'] },
            { id: 'arm_pain', label: 'Arm pain', searchTerms: ['pain'] },
            { id: 'elbow_pain', label: 'Elbow pain', searchTerms: ['pain'] },
            { id: 'wrist_pain', label: 'Wrist pain', searchTerms: ['pain'] },
            { id: 'hand_pain', label: 'Hand pain', searchTerms: ['pain'] },
            { id: 'hip_pain', label: 'Hip pain', searchTerms: ['pain'] },
            { id: 'knee_pain', label: 'Knee pain', searchTerms: ['pain'] },
            { id: 'ankle_pain', label: 'Ankle pain', searchTerms: ['pain'] },
            { id: 'foot_pain', label: 'Foot pain', searchTerms: ['pain'] },
            { id: 'joint_swelling', label: 'Joint swelling' },
            { id: 'joint_stiffness', label: 'Joint stiffness' },
            { id: 'joint_pain', label: 'Joint pain', searchTerms: ['pain'] },
            { id: 'muscle_pain', label: 'Muscle pain', searchTerms: ['pain'] },
            { id: 'muscle_cramps', label: 'Muscle cramps' },
            { id: 'muscle_weakness', label: 'Muscle weakness', searchTerms: ['weak'] },
            { id: 'difficulty_standing', label: 'Difficulty standing' },
            { id: 'msk_difficulty_walking', label: 'Difficulty walking', searchTerms: ['walking'] },
            { id: 'difficulty_moving_limb', label: 'Difficulty moving a limb' },
        ],
    },
    {
        id: 'injury_fall',
        label: 'Injury / Fall / Accident',
        icon: '🤕',
        symptoms: [
            { id: 'fall', label: 'Fall' },
            { id: 'head_injury', label: 'Head injury' },
            { id: 'road_traffic_accident', label: 'Road traffic accident' },
            { id: 'sports_injury', label: 'Sports injury' },
            { id: 'cut', label: 'Cut' },
            { id: 'laceration', label: 'Laceration' },
            { id: 'bleeding', label: 'Bleeding' },
            { id: 'bruising', label: 'Bruising' },
            { id: 'swelling_after_injury', label: 'Swelling after injury' },
            { id: 'suspected_fracture', label: 'Suspected fracture' },
            { id: 'severe_pain_after_injury', label: 'Severe pain after injury', searchTerms: ['pain'] },
            { id: 'unable_bear_weight', label: 'Unable to bear weight' },
            { id: 'unable_move_limb_normally', label: 'Unable to move limb normally' },
            { id: 'loss_of_consciousness_after_injury', label: 'Loss of consciousness after injury' },
        ],
    },
    {
        id: 'skin_wounds',
        label: 'Skin / Wounds',
        icon: '🩹',
        symptoms: [
            { id: 'rash', label: 'Rash' },
            { id: 'itching', label: 'Itching' },
            { id: 'skin_redness', label: 'Redness' },
            { id: 'skin_swelling', label: 'Swelling' },
            { id: 'skin_pain', label: 'Skin pain', searchTerms: ['pain'] },
            { id: 'skin_infection_concern', label: 'Skin infection concern' },
            { id: 'wound', label: 'Wound' },
            { id: 'non_healing_wound', label: 'Non-healing wound' },
            { id: 'pressure_sore', label: 'Pressure sore' },
            { id: 'bed_sore', label: 'Bed sore' },
            { id: 'ulcer', label: 'Ulcer' },
            { id: 'pus_discharge', label: 'Pus/discharge' },
            { id: 'skin_colour_change', label: 'Skin colour change' },
            { id: 'blister', label: 'Blister' },
            { id: 'burn', label: 'Burn' },
        ],
    },
    {
        id: 'diabetes',
        label: 'Diabetes-Related Concerns',
        icon: '🩸',
        symptoms: [
            { id: 'very_high_blood_sugar', label: 'Very high blood sugar reading' },
            { id: 'very_low_blood_sugar', label: 'Very low blood sugar reading' },
            { id: 'shaking', label: 'Shaking' },
            { id: 'diabetes_sweating', label: 'Sweating' },
            { id: 'diabetes_weakness', label: 'Weakness', searchTerms: ['weak'] },
            { id: 'diabetes_confusion', label: 'Confusion' },
            { id: 'diabetes_drowsiness', label: 'Drowsiness' },
            { id: 'diabetes_excessive_thirst', label: 'Excessive thirst' },
            { id: 'diabetes_frequent_urination', label: 'Frequent urination' },
            { id: 'foot_wound', label: 'Foot wound' },
            { id: 'diabetes_non_healing_wound', label: 'Non-healing wound' },
            { id: 'new_vision_difficulty', label: 'New vision difficulty' },
        ],
    },
    {
        id: 'blood_pressure',
        label: 'Blood Pressure / Circulation',
        icon: '💗',
        symptoms: [
            { id: 'very_high_bp_reading', label: 'Very high blood pressure reading' },
            { id: 'low_bp_reading', label: 'Low blood pressure reading' },
            { id: 'bp_dizziness', label: 'Dizziness' },
            { id: 'bp_fainting', label: 'Fainting' },
            { id: 'bp_severe_headache', label: 'Severe headache' },
            { id: 'bp_weakness', label: 'Weakness', searchTerms: ['weak'] },
            { id: 'bp_palpitations', label: 'Palpitations' },
            { id: 'bp_leg_swelling', label: 'Leg swelling' },
            { id: 'cold_extremities', label: 'Cold extremities' },
            { id: 'poor_circulation_concern', label: 'Poor circulation concern' },
        ],
    },
    {
        id: 'fever_infection',
        label: 'Fever / Infection',
        icon: '🌡️',
        symptoms: [
            { id: 'infection_fever', label: 'Fever' },
            { id: 'infection_chills', label: 'Chills' },
            { id: 'shivering', label: 'Shivering' },
            { id: 'infection_sweating', label: 'Sweating' },
            { id: 'infection_cough', label: 'Cough' },
            { id: 'infection_sore_throat', label: 'Sore throat' },
            { id: 'infection_runny_nose', label: 'Runny nose' },
            { id: 'infection_burning_urination', label: 'Burning urination' },
            { id: 'infection_abdominal_pain', label: 'Abdominal pain', searchTerms: ['pain'] },
            { id: 'infection_vomiting', label: 'Vomiting' },
            { id: 'infection_diarrhea', label: 'Diarrhea' },
            { id: 'wound_discharge', label: 'Wound discharge' },
            { id: 'skin_redness_swelling', label: 'Skin redness/swelling' },
            { id: 'reduced_consciousness', label: 'Reduced consciousness' },
            { id: 'infection_confusion', label: 'Confusion' },
        ],
    },
    {
        id: 'elderly_geriatric',
        label: 'Elderly / Geriatric',
        icon: '👵',
        symptoms: [
            { id: 'recent_fall', label: 'Recent fall' },
            { id: 'new_confusion', label: 'New confusion' },
            { id: 'sudden_behaviour_change', label: 'Sudden behaviour change' },
            { id: 'new_weakness', label: 'New weakness', searchTerms: ['weak'] },
            { id: 'difficulty_walking', label: 'Difficulty walking', searchTerms: ['walking'] },
            { id: 'reduced_mobility', label: 'Reduced mobility' },
            { id: 'reduced_food_intake', label: 'Reduced food intake' },
            { id: 'reduced_fluid_intake', label: 'Reduced fluid intake' },
            { id: 'elderly_reduced_urine_output', label: 'Reduced urine output' },
            { id: 'excessive_sleepiness', label: 'Excessive sleepiness' },
            { id: 'elderly_dizziness', label: 'Dizziness' },
            { id: 'elderly_fainting', label: 'Fainting' },
            { id: 'elderly_new_breathing_difficulty', label: 'New breathing difficulty', searchTerms: ['breath'] },
            { id: 'elderly_chest_discomfort', label: 'Chest discomfort' },
            { id: 'elderly_swelling_legs', label: 'Swelling of legs' },
            { id: 'new_incontinence', label: 'New incontinence' },
            { id: 'loss_of_independence', label: 'Loss of independence' },
            { id: 'difficulty_getting_out_of_bed', label: 'Difficulty getting out of bed' },
            { id: 'caregiver_concern', label: 'Caregiver concern' },
            { id: 'sudden_decline_usual_health', label: 'Sudden decline from usual health' },
        ],
    },
    {
        id: 'mens_health',
        label: "Men's Health",
        icon: '👨',
        symptoms: [
            { id: 'testicular_pain', label: 'Testicular pain', searchTerms: ['pain'] },
            { id: 'testicular_swelling', label: 'Testicular swelling' },
            { id: 'scrotal_swelling', label: 'Scrotal swelling' },
            { id: 'mens_difficulty_urinating', label: 'Difficulty urinating' },
            { id: 'mens_blood_in_urine', label: 'Blood in urine' },
            { id: 'erectile_difficulty', label: 'Erectile difficulty' },
            { id: 'penile_discharge', label: 'Penile discharge' },
            { id: 'groin_pain', label: 'Groin pain', searchTerms: ['pain'] },
        ],
    },
    {
        id: 'womens_health',
        label: "Women's Health",
        icon: '👩',
        symptoms: [
            { id: 'pelvic_pain', label: 'Pelvic pain', searchTerms: ['pain'] },
            { id: 'abnormal_vaginal_bleeding', label: 'Abnormal vaginal bleeding' },
            { id: 'heavy_bleeding', label: 'Heavy bleeding' },
            { id: 'vaginal_discharge', label: 'Vaginal discharge' },
            { id: 'womens_painful_urination', label: 'Painful urination' },
            { id: 'breast_pain', label: 'Breast pain', searchTerms: ['pain'] },
            { id: 'breast_lump', label: 'Breast lump' },
            { id: 'pregnancy_related_concern', label: 'Pregnancy-related concern' },
            { id: 'postpartum_concern', label: 'Postpartum concern' },
        ],
    },
    {
        id: 'mental_behavioural',
        label: 'Mental / Behavioural',
        icon: '💭',
        symptoms: [
            { id: 'anxiety', label: 'Anxiety' },
            { id: 'feeling_unusually_distressed', label: 'Feeling unusually distressed' },
            { id: 'sleep_disturbance', label: 'Sleep disturbance' },
            { id: 'change_in_behaviour', label: 'Change in behaviour' },
            { id: 'mental_confusion', label: 'Confusion' },
            { id: 'agitation', label: 'Agitation' },
            { id: 'withdrawal', label: 'Withdrawal' },
            { id: 'sudden_personality_change', label: 'Sudden personality change' },
            { id: 'memory_concerns', label: 'Memory concerns' },
            { id: 'mental_caregiver_concern', label: 'Caregiver concern about behaviour' },
        ],
    },
    {
        id: 'general_other',
        label: 'General / Other',
        icon: '❓',
        symptoms: [
            { id: 'unknown_symptom', label: "I don't know what the symptom is" },
            { id: 'multiple_problems', label: 'Multiple problems' },
            { id: 'other', label: 'Other' },
            { id: 'no_specific_symptom', label: 'No specific symptom — general health concern' },
        ],
    },
];
exports.DurationOption = {
    LESS_THAN_1_HOUR: 'LESS_THAN_1_HOUR',
    ONE_TO_6_HOURS: 'ONE_TO_6_HOURS',
    SIX_TO_24_HOURS: 'SIX_TO_24_HOURS',
    ONE_TO_3_DAYS: 'ONE_TO_3_DAYS',
    FOUR_TO_7_DAYS: 'FOUR_TO_7_DAYS',
    ONE_TO_2_WEEKS: 'ONE_TO_2_WEEKS',
    MORE_THAN_2_WEEKS: 'MORE_THAN_2_WEEKS',
    RECURRENT: 'RECURRENT',
    NOT_SURE: 'NOT_SURE',
};
exports.DURATION_LABELS = {
    LESS_THAN_1_HOUR: 'Less than 1 hour',
    ONE_TO_6_HOURS: '1–6 hours',
    SIX_TO_24_HOURS: '6–24 hours',
    ONE_TO_3_DAYS: '1–3 days',
    FOUR_TO_7_DAYS: '4–7 days',
    ONE_TO_2_WEEKS: '1–2 weeks',
    MORE_THAN_2_WEEKS: 'More than 2 weeks',
    RECURRENT: 'Recurrent',
    NOT_SURE: 'Not sure',
};
exports.SeverityOption = {
    MILD: 'MILD',
    MODERATE: 'MODERATE',
    SEVERE: 'SEVERE',
    VERY_SEVERE: 'VERY_SEVERE',
    NOT_SURE: 'NOT_SURE',
};
exports.SEVERITY_LABELS = {
    MILD: 'Mild',
    MODERATE: 'Moderate',
    SEVERE: 'Severe',
    VERY_SEVERE: 'Very severe',
    NOT_SURE: 'Not sure',
};
exports.BODY_REGION_OPTIONS = [
    { id: 'upper', label: 'Upper' },
    { id: 'lower', label: 'Lower' },
    { id: 'left', label: 'Left side' },
    { id: 'right', label: 'Right side' },
    { id: 'whole', label: 'Whole area' },
    { id: 'not_sure', label: 'Not sure' },
];
const CHEST_PAIN_SIGNS = [
    { id: 'difficulty_breathing', label: 'Breathlessness with the discomfort?' },
    { id: 'sweating', label: 'Sweating with the discomfort?' },
    { id: 'fainting', label: 'Fainting?' },
    { id: 'severe_weakness', label: 'Severe weakness?' },
    { id: 'pain_spreading_arm_jaw_back', label: 'Pain spreading to arm/shoulder/jaw/back?' },
    { id: 'sudden_onset', label: 'Did it start suddenly?' },
    { id: 'worsening', label: 'Is it getting worse?' },
    { id: 'during_exertion', label: 'Did it occur during exertion?' },
];
const BREATHING_DIFFICULTY_SIGNS = [
    { id: 'severe_breathing_difficulty', label: 'Severe breathing difficulty?' },
    { id: 'unable_to_speak_normally', label: 'Unable to speak full sentences because of breathlessness?' },
    { id: 'blue_grey_lips_face', label: 'Blue/grey lips or face?' },
    { id: 'chest_pain', label: 'Chest pain?' },
    { id: 'fainting', label: 'Fainting?' },
    { id: 'confusion', label: 'Confusion?' },
    { id: 'sudden_onset', label: 'Did it start suddenly?' },
    { id: 'occurs_at_rest', label: 'Does it occur at rest?' },
];
const NEUROLOGICAL_SIGNS = [
    { id: 'sudden_onset', label: 'Sudden onset?' },
    { id: 'facial_drooping', label: 'Facial drooping?' },
    { id: 'arm_leg_weakness', label: 'Arm/leg weakness?' },
    { id: 'difficulty_speaking', label: 'Difficulty speaking?' },
    { id: 'loss_of_consciousness', label: 'Loss of consciousness?' },
    { id: 'seizure', label: 'Seizure?' },
    { id: 'severe_sudden_headache', label: 'Severe sudden headache?' },
    { id: 'new_confusion', label: 'New confusion?' },
];
const GI_SIGNS = [
    { id: 'blood', label: 'Blood?' },
    { id: 'severe_abdominal_pain', label: 'Severe abdominal pain?' },
    { id: 'fainting', label: 'Fainting?' },
    { id: 'confusion', label: 'Confusion?' },
    { id: 'unable_keep_fluids_down', label: 'Unable to keep fluids down?' },
    { id: 'very_reduced_urine_output', label: 'Very reduced urine output?' },
];
const ABDOMINAL_PAIN_SIGNS = [
    { id: 'sudden_onset', label: 'Did it begin suddenly?' },
    { id: 'worsening', label: 'Is it worsening?' },
    { id: 'comes_and_goes', label: 'Does it come and go?' },
];
const FALL_INJURY_SIGNS = [
    { id: 'loss_of_consciousness', label: 'Was there loss of consciousness?' },
    { id: 'head_injury', label: 'Was there head impact?' },
    { id: 'severe_pain', label: 'Severe pain?' },
    { id: 'unable_to_stand_walk', label: 'Unable to stand/walk?' },
    { id: 'bleeding', label: 'Is there uncontrolled bleeding?' },
    { id: 'blood_thinner_use', label: 'Is the patient taking blood thinners?' },
];
const DIABETES_SIGNS = [
    { id: 'confusion', label: 'Confusion?' },
    { id: 'drowsiness', label: 'Drowsiness?' },
    { id: 'unresponsive', label: 'Difficult to wake / unresponsive?' },
];
const BP_SIGNS = [
    { id: 'severe_headache', label: 'Severe headache?' },
    { id: 'chest_pain', label: 'Chest pain?' },
    { id: 'confusion', label: 'Confusion?' },
    { id: 'vision_change', label: 'Sudden vision change?' },
];
const FEVER_SIGNS = [
    { id: 'reduced_consciousness', label: 'Reduced consciousness or very hard to wake?' },
    { id: 'confusion', label: 'Confusion?' },
    { id: 'rash', label: 'New rash with the fever?' },
    { id: 'stiff_neck', label: 'Stiff neck?' },
];
const ELDERLY_SIGNS = [
    { id: 'significantly_different_from_usual', label: "Is this significantly different from the patient's usual condition?" },
];
const WOMENS_HEALTH_BLEEDING_SIGNS = [
    { id: 'fainting', label: 'Fainting or feeling faint?' },
    { id: 'severe_pain', label: 'Severe pain?' },
    { id: 'soaking_through_protection', label: 'Soaking through pads/protection within an hour?' },
];
const NEURO_SYMPTOM_IDS = [
    'headache',
    'sudden_severe_headache',
    'new_severe_headache',
    'neuro_dizziness',
    'vertigo',
    'neuro_fainting',
    'loss_of_consciousness',
    'confusion',
    'sudden_confusion',
    'drowsiness',
    'unusual_sleepiness',
    'difficulty_speaking',
    'slurred_speech',
    'difficulty_understanding_speech',
    'facial_weakness',
    'facial_drooping',
    'arm_weakness',
    'leg_weakness',
    'one_sided_weakness',
    'numbness',
    'one_sided_numbness',
    'tingling',
    'loss_of_balance',
    'sudden_difficulty_walking',
    'vision_loss',
    'blurred_vision',
    'double_vision',
    'seizure',
    'tremors',
    'new_change_in_behaviour',
    'memory_disturbance',
];
// Exported so the wizard UI can conditionally render special field types
// (numeric BP/temperature entry, body-region picker, known-condition
// question) for exactly the symptoms that need them, without duplicating
// this list in every frontend.
exports.BREATHING_IDS = [
    'difficulty_breathing',
    'shortness_of_breath',
    'breathlessness',
    'breathing_faster_than_usual',
    'noisy_breathing',
    'difficulty_breathing_lying_down',
    'waking_up_breathless',
    'new_breathing_difficulty',
    'worsening_breathing_difficulty',
];
exports.CHEST_PAIN_IDS = ['chest_pain', 'chest_pressure', 'chest_tightness', 'chest_discomfort', 'chest_heaviness'];
exports.FALL_INJURY_IDS = ['fall', 'recent_fall', 'head_injury', 'road_traffic_accident', 'sports_injury'];
exports.GI_IDS = ['vomiting', 'diarrhea', 'repeated_vomiting'];
exports.ABDOMINAL_PAIN_IDS = ['abdominal_pain', 'upper_abdominal_pain', 'lower_abdominal_pain', 'right_abdominal_pain', 'left_abdominal_pain'];
exports.DIABETES_CATEGORY_IDS = [
    'very_high_blood_sugar',
    'very_low_blood_sugar',
    'shaking',
    'diabetes_sweating',
    'diabetes_weakness',
    'diabetes_confusion',
    'diabetes_drowsiness',
    'diabetes_excessive_thirst',
    'diabetes_frequent_urination',
    'foot_wound',
    'diabetes_non_healing_wound',
    'new_vision_difficulty',
];
exports.DIABETES_EXTREME_IDS = ['very_high_blood_sugar', 'very_low_blood_sugar'];
exports.BP_EXTREME_IDS = ['very_high_bp_reading', 'low_bp_reading'];
exports.FEVER_IDS = ['infection_fever', 'fever'];
exports.ELDERLY_IDS = [
    'recent_fall',
    'new_confusion',
    'sudden_behaviour_change',
    'new_weakness',
    'difficulty_walking',
    'reduced_mobility',
    'excessive_sleepiness',
    'elderly_dizziness',
    'elderly_fainting',
    'elderly_new_breathing_difficulty',
    'elderly_chest_discomfort',
    'new_incontinence',
    'sudden_decline_usual_health',
];
exports.WOMENS_HEALTH_BLEEDING_IDS = ['abnormal_vaginal_bleeding', 'heavy_bleeding'];
/** Only the symptoms that have follow-up questions appear here — every other
 *  selected symptom simply has none, per "only show relevant follow-up
 *  questions based on selected symptoms." */
exports.ASSOCIATED_SIGN_QUESTIONS = {
    ...Object.fromEntries(exports.CHEST_PAIN_IDS.map((id) => [id, CHEST_PAIN_SIGNS])),
    ...Object.fromEntries(exports.BREATHING_IDS.map((id) => [id, BREATHING_DIFFICULTY_SIGNS])),
    ...Object.fromEntries(NEURO_SYMPTOM_IDS.map((id) => [id, NEUROLOGICAL_SIGNS])),
    ...Object.fromEntries(exports.GI_IDS.map((id) => [id, GI_SIGNS])),
    ...Object.fromEntries(exports.ABDOMINAL_PAIN_IDS.map((id) => [id, ABDOMINAL_PAIN_SIGNS])),
    ...Object.fromEntries(exports.FALL_INJURY_IDS.map((id) => [id, FALL_INJURY_SIGNS])),
    ...Object.fromEntries(exports.DIABETES_EXTREME_IDS.map((id) => [id, DIABETES_SIGNS])),
    ...Object.fromEntries(exports.BP_EXTREME_IDS.map((id) => [id, BP_SIGNS])),
    ...Object.fromEntries(exports.FEVER_IDS.map((id) => [id, FEVER_SIGNS])),
    ...Object.fromEntries(exports.ELDERLY_IDS.map((id) => [id, ELDERLY_SIGNS])),
    ...Object.fromEntries(exports.WOMENS_HEALTH_BLEEDING_IDS.map((id) => [id, WOMENS_HEALTH_BLEEDING_SIGNS])),
};
function findSymptom(answers, id) {
    return answers.symptoms.find((s) => s.symptomId === id);
}
function findAnySymptom(answers, ids) {
    return answers.symptoms.find((s) => ids.includes(s.symptomId));
}
function sign(symptom, signId) {
    return !!symptom?.associatedSigns?.[signId];
}
function anySign(answers, ids, signId) {
    return ids.some((id) => sign(findSymptom(answers, id), signId));
}
function isSevere(symptom) {
    return symptom?.severity === exports.SeverityOption.SEVERE || symptom?.severity === exports.SeverityOption.VERY_SEVERE;
}
function anySelected(answers, ids) {
    return ids.some((id) => !!findSymptom(answers, id));
}
// Built directly from the red-flag examples specified across the product
// briefs (see the top-of-file notice — not independently clinically authored).
const RED_FLAG_RULES = [
    {
        id: 'severe_breathing_difficulty',
        label: 'Severe breathing difficulty reported',
        priority: 'RED',
        test: (a) => {
            const s = findAnySymptom(a, exports.BREATHING_IDS);
            return (!!s &&
                (isSevere(s) ||
                    anySign(a, exports.BREATHING_IDS, 'severe_breathing_difficulty') ||
                    anySign(a, exports.BREATHING_IDS, 'unable_to_speak_normally') ||
                    anySign(a, exports.BREATHING_IDS, 'blue_grey_lips_face')));
        },
    },
    {
        id: 'possible_cardiac_chest_pain',
        label: 'Chest pain with cardiac-pattern warning signs',
        priority: 'RED',
        test: (a) => {
            const s = findAnySymptom(a, exports.CHEST_PAIN_IDS);
            return (!!s &&
                (isSevere(s) ||
                    anySign(a, exports.CHEST_PAIN_IDS, 'pain_spreading_arm_jaw_back') ||
                    anySign(a, exports.CHEST_PAIN_IDS, 'sweating') ||
                    anySign(a, exports.CHEST_PAIN_IDS, 'fainting') ||
                    anySign(a, exports.CHEST_PAIN_IDS, 'severe_weakness') ||
                    anySign(a, exports.CHEST_PAIN_IDS, 'difficulty_breathing')));
        },
    },
    {
        id: 'loss_of_consciousness',
        label: 'Loss of consciousness reported or associated',
        priority: 'RED',
        test: (a) => !!findSymptom(a, 'loss_of_consciousness') ||
            !!findSymptom(a, 'loss_of_consciousness_after_injury') ||
            anySign(a, NEURO_SYMPTOM_IDS, 'loss_of_consciousness') ||
            anySign(a, exports.FALL_INJURY_IDS, 'loss_of_consciousness') ||
            anySign(a, exports.GI_IDS, 'fainting'),
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
        test: (a) => !!findSymptom(a, 'facial_weakness') ||
            !!findSymptom(a, 'facial_drooping') ||
            !!findSymptom(a, 'one_sided_weakness') ||
            anySign(a, NEURO_SYMPTOM_IDS, 'facial_drooping') ||
            anySign(a, NEURO_SYMPTOM_IDS, 'arm_leg_weakness'),
    },
    {
        id: 'sudden_difficulty_speaking',
        label: 'Sudden difficulty speaking',
        priority: 'RED',
        test: (a) => !!findSymptom(a, 'difficulty_speaking') ||
            !!findSymptom(a, 'slurred_speech') ||
            !!findSymptom(a, 'difficulty_understanding_speech') ||
            anySign(a, NEURO_SYMPTOM_IDS, 'difficulty_speaking'),
    },
    {
        id: 'severe_sudden_confusion',
        label: 'Severe or sudden confusion',
        priority: 'RED',
        test: (a) => {
            const c = findAnySymptom(a, ['confusion', 'sudden_confusion', 'reduced_consciousness']);
            return ((!!c && (isSevere(c) || c.duration === exports.DurationOption.LESS_THAN_1_HOUR || c.duration === exports.DurationOption.ONE_TO_6_HOURS)) ||
                !!findSymptom(a, 'sudden_confusion') ||
                !!findSymptom(a, 'reduced_consciousness') ||
                anySign(a, NEURO_SYMPTOM_IDS, 'new_confusion') ||
                anySign(a, exports.FEVER_IDS, 'reduced_consciousness') ||
                anySign(a, exports.FEVER_IDS, 'confusion'));
        },
    },
    {
        id: 'major_bleeding',
        label: 'Possible major bleeding',
        priority: 'RED',
        test: (a) => !!findSymptom(a, 'coughing_blood') ||
            !!findSymptom(a, 'vomiting_blood') ||
            anySign(a, exports.FALL_INJURY_IDS, 'bleeding') ||
            isSevere(findSymptom(a, 'blood_in_stool')) ||
            isSevere(findSymptom(a, 'black_stool')) ||
            anySign(a, exports.WOMENS_HEALTH_BLEEDING_IDS, 'soaking_through_protection') ||
            anySign(a, exports.WOMENS_HEALTH_BLEEDING_IDS, 'fainting'),
    },
    {
        id: 'severe_headache_with_neuro_signs',
        label: 'Severe headache with neurological warning signs',
        priority: 'RED',
        test: (a) => {
            const h = findAnySymptom(a, ['headache', 'sudden_severe_headache', 'new_severe_headache']);
            if (!h)
                return false;
            return (!!findSymptom(a, 'sudden_severe_headache') ||
                sign(h, 'severe_sudden_headache') ||
                sign(h, 'facial_drooping') ||
                sign(h, 'arm_leg_weakness') ||
                sign(h, 'difficulty_speaking') ||
                sign(h, 'loss_of_consciousness') ||
                sign(h, 'seizure'));
        },
    },
    {
        id: 'major_trauma',
        label: 'Major trauma / fall with a warning sign',
        priority: 'RED',
        test: (a) => !!findSymptom(a, 'head_injury') ||
            anySign(a, exports.FALL_INJURY_IDS, 'head_injury') ||
            (anySign(a, exports.FALL_INJURY_IDS, 'severe_pain') && anySign(a, exports.FALL_INJURY_IDS, 'unable_to_stand_walk')) ||
            (anySign(a, exports.FALL_INJURY_IDS, 'blood_thinner_use') && anySign(a, exports.FALL_INJURY_IDS, 'bleeding')),
    },
    {
        id: 'sudden_vision_loss',
        label: 'Sudden vision loss',
        priority: 'RED',
        test: (a) => !!findSymptom(a, 'sudden_vision_loss') || !!findSymptom(a, 'vision_loss'),
    },
    {
        id: 'diabetic_emergency_pattern',
        label: 'Possible diabetic emergency (extreme reading with confusion/drowsiness)',
        priority: 'RED',
        test: (a) => {
            const extreme = findAnySymptom(a, exports.DIABETES_EXTREME_IDS);
            return !!extreme && (anySign(a, exports.DIABETES_EXTREME_IDS, 'confusion') || anySign(a, exports.DIABETES_EXTREME_IDS, 'drowsiness') || anySign(a, exports.DIABETES_EXTREME_IDS, 'unresponsive'));
        },
    },
    {
        id: 'bp_emergency_pattern',
        label: 'Extreme blood pressure reading with a warning sign',
        priority: 'RED',
        test: (a) => {
            const extreme = findAnySymptom(a, exports.BP_EXTREME_IDS);
            return (!!extreme &&
                (anySign(a, exports.BP_EXTREME_IDS, 'severe_headache') ||
                    anySign(a, exports.BP_EXTREME_IDS, 'chest_pain') ||
                    anySign(a, exports.BP_EXTREME_IDS, 'confusion') ||
                    anySign(a, exports.BP_EXTREME_IDS, 'vision_change')));
        },
    },
    {
        id: 'high_fever_with_reduced_consciousness',
        label: 'Fever with reduced consciousness or confusion',
        priority: 'RED',
        test: (a) => anySign(a, exports.FEVER_IDS, 'reduced_consciousness') || anySign(a, exports.FEVER_IDS, 'confusion'),
    },
];
const ORANGE_FLAG_RULES = [
    {
        id: 'elderly_functional_decline',
        label: 'Elderly functional-decline or caregiver concern signal',
        priority: 'ORANGE',
        test: (a) => anySelected(a, exports.ELDERLY_IDS) || anySign(a, exports.ELDERLY_IDS, 'significantly_different_from_usual'),
    },
    {
        id: 'gi_dehydration_risk',
        label: 'Possible dehydration from vomiting/diarrhea',
        priority: 'ORANGE',
        test: (a) => anySign(a, exports.GI_IDS, 'unable_keep_fluids_down') || anySign(a, exports.GI_IDS, 'very_reduced_urine_output'),
    },
    {
        id: 'reduced_urine_output',
        label: 'Reduced urine output',
        priority: 'ORANGE',
        test: (a) => !!findSymptom(a, 'reduced_urine_output') || !!findSymptom(a, 'unable_to_pass_urine'),
    },
    {
        id: 'diabetes_extreme_reading',
        label: 'Extreme blood sugar reading reported',
        priority: 'ORANGE',
        test: (a) => anySelected(a, exports.DIABETES_EXTREME_IDS),
    },
    {
        id: 'bp_extreme_reading',
        label: 'Extreme blood pressure reading reported',
        priority: 'ORANGE',
        test: (a) => anySelected(a, exports.BP_EXTREME_IDS),
    },
    {
        id: 'high_fever',
        label: 'Fever reported',
        priority: 'ORANGE',
        test: (a) => isSevere(findAnySymptom(a, exports.FEVER_IDS)),
    },
    {
        id: 'womens_health_bleeding',
        label: 'Abnormal or heavy bleeding reported',
        priority: 'ORANGE',
        test: (a) => anySelected(a, exports.WOMENS_HEALTH_BLEEDING_IDS),
    },
    {
        id: 'any_severe_symptom',
        label: 'A selected symptom marked severe',
        priority: 'ORANGE',
        // Severity alone must never drive a RED/emergency classification (per the
        // brief), but it's a reasonable, explicit ORANGE prioritization signal.
        test: (a) => a.symptoms.some((s) => s.severity === exports.SeverityOption.SEVERE || s.severity === exports.SeverityOption.VERY_SEVERE),
    },
];
/** Authoritative classification. Called server-side on every visit creation
 *  (never trusts a client-supplied priority) and, identically, client-side
 *  for instant feedback during the review step. */
function classifyTriage(answers) {
    const redMatches = RED_FLAG_RULES.filter((r) => r.test(answers));
    if (redMatches.length > 0) {
        return {
            priority: enums_1.TriagePriority.RED,
            matchedRedFlags: redMatches.map((r) => ({ ruleId: r.id, label: r.label })),
        };
    }
    const orangeMatches = ORANGE_FLAG_RULES.filter((r) => r.test(answers));
    if (orangeMatches.length > 0) {
        return {
            priority: enums_1.TriagePriority.ORANGE,
            matchedRedFlags: orangeMatches.map((r) => ({ ruleId: r.id, label: r.label })),
        };
    }
    return { priority: enums_1.TriagePriority.GREEN, matchedRedFlags: [] };
}
exports.TRIAGE_MESSAGES = {
    RED: 'Your answers may indicate a situation that needs urgent medical attention. Please seek emergency medical care or contact the appropriate emergency service immediately.',
    ORANGE: 'Based on your answers, this request will be marked for priority assessment.',
    GREEN: 'Based on your answers, you can continue to request a routine home visit. Your doctor will assess you.',
};
