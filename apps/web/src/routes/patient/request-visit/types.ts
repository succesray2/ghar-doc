import type { BookingRelation, DurationOption, SeverityOption } from '@ghar-doc/shared';

export interface SymptomDetail {
  duration?: DurationOption;
  severity?: SeverityOption;
  associatedSigns: Record<string, boolean>;
  bodyRegion?: string;
  numericReadings?: {
    systolic?: number;
    diastolic?: number;
    temperature?: number;
    temperatureUnit?: 'C' | 'F';
  };
  knownCondition?: boolean;
}

export interface WizardState {
  bookingFor: BookingRelation;
  patientName: string;
  patientAge: string;
  patientSex: string;
  caregiverName: string;
  caregiverPhone: string;
  selectedSymptomIds: string[];
  symptomDetails: Record<string, SymptomDetail>;
  otherSymptomText: string;
  notes: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export const INITIAL_WIZARD_STATE: WizardState = {
  bookingFor: 'SELF',
  patientName: '',
  patientAge: '',
  patientSex: '',
  caregiverName: '',
  caregiverPhone: '',
  selectedSymptomIds: [],
  symptomDetails: {},
  otherSymptomText: '',
  notes: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};
