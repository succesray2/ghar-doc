import type { BookingRelation, NursingServiceType, SafetyNetAnswers } from '@ghar-doc/shared';

export interface NursingWizardState {
  bookingFor: BookingRelation;
  patientName: string;
  patientAge: string;
  patientSex: string;
  caregiverName: string;
  caregiverPhone: string;
  safetyCheckAnswers: SafetyNetAnswers;
  nursingServiceType: NursingServiceType | '';
  otherServiceText: string;
  careNotes: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export const INITIAL_NURSING_WIZARD_STATE: NursingWizardState = {
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
  nursingServiceType: '',
  otherServiceText: '',
  careNotes: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};
