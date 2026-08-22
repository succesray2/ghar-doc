import type { BookingRelation, MobilityLevel, PhysiotherapyConditionType, SafetyNetAnswers } from '@ghar-doc/shared';

export interface PhysiotherapyWizardState {
  bookingFor: BookingRelation;
  patientName: string;
  patientAge: string;
  patientSex: string;
  caregiverName: string;
  caregiverPhone: string;
  safetyCheckAnswers: SafetyNetAnswers;
  conditionType: PhysiotherapyConditionType | '';
  otherConditionText: string;
  mobilityLevel: MobilityLevel | '';
  sessionGoal: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export const INITIAL_PHYSIOTHERAPY_WIZARD_STATE: PhysiotherapyWizardState = {
  bookingFor: 'SELF',
  patientName: '',
  patientAge: '',
  patientSex: '',
  caregiverName: '',
  caregiverPhone: '',
  safetyCheckAnswers: {
    chestPain: false,
    breathingDifficulty: false,
    severeBleeding: false,
    lossOfConsciousnessOrConfusion: false,
  },
  conditionType: '',
  otherConditionText: '',
  mobilityLevel: '',
  sessionGoal: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};
