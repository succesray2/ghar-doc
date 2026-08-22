import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateVisitInput } from '@ghar-doc/shared';
import { useCreateVisit } from '../../../hooks/useVisits';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { SafetyNetCheckStep } from '../SafetyNetCheckStep';
import { WhoNeedsCareStep } from './WhoNeedsCareStep';
import { PhysiotherapyDetailsStep } from './PhysiotherapyDetailsStep';
import { LocationReviewStep } from './LocationReviewStep';
import { INITIAL_PHYSIOTHERAPY_WIZARD_STATE, type PhysiotherapyWizardState } from './types';

const STEP_TITLES = ['Who needs care', 'Safety check', 'About the condition', 'Location & review'];
const TOTAL_STEPS = STEP_TITLES.length;
const SAFETY_STEP = 2;
const DETAILS_STEP = 3;
const LOCATION_STEP = 4;

export function RequestPhysiotherapyWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<PhysiotherapyWizardState>(INITIAL_PHYSIOTHERAPY_WIZARD_STATE);
  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const createVisit = useCreateVisit();

  const update = (patch: Partial<PhysiotherapyWizardState>) => setState((s) => ({ ...s, ...patch }));

  const safetyTriggered = Object.values(state.safetyCheckAnswers).some(Boolean);

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!state.conditionType) errors.conditionType = 'Please choose one';
    if (state.conditionType === 'OTHER' && !state.otherConditionText.trim()) errors.otherConditionText = 'Required';
    if (!state.mobilityLevel) errors.mobilityLevel = 'Please choose one';
    setDetailsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = () => {
    const errors: Record<string, string> = {};
    if (!state.addressLine1.trim()) errors.addressLine1 = 'Required';
    if (!state.city.trim()) errors.city = 'Required';
    if (!state.state.trim()) errors.state = 'Required';
    if (!state.postalCode.trim()) errors.postalCode = 'Required';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceed = (): boolean => {
    if (step === SAFETY_STEP) return !safetyTriggered;
    return true;
  };

  const handleNext = () => {
    if (step === DETAILS_STEP && !validateDetails()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    if (!validateAddress()) return;

    const reasonForVisit =
      state.conditionType === 'OTHER' ? state.otherConditionText : `Physiotherapy: ${state.conditionType}`;

    const payload: CreateVisitInput = {
      serviceType: 'PHYSIOTHERAPY',
      reasonForVisit: reasonForVisit || 'Physiotherapy request',
      addressLine1: state.addressLine1,
      addressLine2: state.addressLine2 || undefined,
      city: state.city,
      state: state.state,
      postalCode: state.postalCode,
      bookingFor: state.bookingFor,
      patientName: state.bookingFor !== 'SELF' ? state.patientName : undefined,
      patientAge: state.bookingFor !== 'SELF' && state.patientAge ? Number(state.patientAge) : undefined,
      patientSex: state.bookingFor !== 'SELF' ? state.patientSex || undefined : undefined,
      caregiverName: state.bookingFor !== 'SELF' ? state.caregiverName : undefined,
      caregiverPhone: state.bookingFor !== 'SELF' ? state.caregiverPhone : undefined,
      physiotherapyDetails: {
        conditionType: state.conditionType || 'OTHER',
        otherConditionText: state.otherConditionText || undefined,
        mobilityLevel: state.mobilityLevel || 'INDEPENDENT',
        sessionGoal: state.sessionGoal || undefined,
      },
      safetyCheckAnswers: state.safetyCheckAnswers,
      redFlagAcknowledged: false,
    };

    createVisit.mutate(payload, {
      onSuccess: () => navigate('/patient/visits'),
      onError: (err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (err as any)?.response?.data?.message;
        setSubmitError(typeof message === 'string' ? message : 'Could not submit your request. Please try again.');
      },
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{STEP_TITLES[step - 1]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      {step === 1 && <WhoNeedsCareStep state={state} onChange={update} />}
      {step === SAFETY_STEP && (
        <SafetyNetCheckStep
          answers={state.safetyCheckAnswers}
          onChange={(patch) => update({ safetyCheckAnswers: { ...state.safetyCheckAnswers, ...patch } })}
        />
      )}
      {step === DETAILS_STEP && <PhysiotherapyDetailsStep state={state} onChange={update} errors={detailsErrors} />}
      {step === LOCATION_STEP && <LocationReviewStep state={state} onChange={update} errors={addressErrors} />}

      {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Back
        </Button>
        {step < TOTAL_STEPS ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={createVisit.isPending}>
            {createVisit.isPending ? 'Submitting…' : 'Request physiotherapy'}
          </Button>
        )}
      </div>
    </Card>
  );
}
