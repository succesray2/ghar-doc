import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CreateVisitInput } from '@ghar-doc/shared';
import { useCreateVisit } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';
import { SafetyNetCheckStep } from './SafetyNetCheckStep';
import { WhoNeedsCareStep } from './request-nursing/WhoNeedsCareStep';
import { NursingDetailsStep } from './request-nursing/NursingDetailsStep';
import { LocationReviewStep } from './request-nursing/LocationReviewStep';
import { INITIAL_NURSING_WIZARD_STATE, type NursingWizardState } from './request-nursing/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'RequestNursing'>;

const STEP_TITLES = ['Who needs care', 'Safety check', 'What do you need', 'Location & review'];
const TOTAL_STEPS = STEP_TITLES.length;
const SAFETY_STEP = 2;
const DETAILS_STEP = 3;
const LOCATION_STEP = 4;

export function RequestNursingScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<NursingWizardState>(INITIAL_NURSING_WIZARD_STATE);
  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createVisit = useCreateVisit();

  const update = (patch: Partial<NursingWizardState>) => setState((s) => ({ ...s, ...patch }));

  const safetyTriggered = Object.values(state.safetyCheckAnswers).some(Boolean);

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!state.nursingServiceType) errors.nursingServiceType = 'Please choose one';
    if (state.nursingServiceType === 'OTHER' && !state.otherServiceText.trim()) errors.otherServiceText = 'Required';
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

    const reasonForVisit = state.nursingServiceType === 'OTHER' ? state.otherServiceText : `Nursing: ${state.nursingServiceType}`;

    const payload: CreateVisitInput = {
      serviceType: 'NURSING',
      reasonForVisit: reasonForVisit || 'Nursing care request',
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
      nursingDetails: {
        nursingServiceType: state.nursingServiceType || 'OTHER',
        otherServiceText: state.otherServiceText || undefined,
        careNotes: state.careNotes || undefined,
      },
      safetyCheckAnswers: state.safetyCheckAnswers,
      redFlagAcknowledged: false,
    };

    createVisit.mutate(payload, {
      onSuccess: () => {
        setState(INITIAL_NURSING_WIZARD_STATE);
        setStep(1);
        navigation.navigate('PatientTabs', { screen: 'MyVisits' });
      },
      onError: (err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (err as any)?.response?.data?.message;
        setSubmitError(typeof message === 'string' ? message : 'Could not submit your request. Please try again.');
      },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <View style={styles.progressWrap}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>Step {step} of {TOTAL_STEPS}</Text>
              <Text style={styles.progressText}>{STEP_TITLES[step - 1]}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
            </View>
          </View>

          {step === 1 && <WhoNeedsCareStep state={state} onChange={update} />}
          {step === SAFETY_STEP && (
            <SafetyNetCheckStep
              answers={state.safetyCheckAnswers}
              onChange={(patch) => update({ safetyCheckAnswers: { ...state.safetyCheckAnswers, ...patch } })}
              onRequestDoctor={() => navigation.navigate('RequestVisit', undefined)}
            />
          )}
          {step === DETAILS_STEP && <NursingDetailsStep state={state} onChange={update} errors={detailsErrors} />}
          {step === LOCATION_STEP && <LocationReviewStep state={state} onChange={update} errors={addressErrors} />}

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          <View style={styles.actions}>
            {step > 1 && (
              <View style={styles.actionButton}>
                <Button title="Back" variant="secondary" onPress={() => setStep((s) => Math.max(1, s - 1))} />
              </View>
            )}
            <View style={styles.actionButton}>
              {step < TOTAL_STEPS ? (
                <Button title="Next" onPress={handleNext} disabled={!canProceed()} />
              ) : (
                <Button
                  title={createVisit.isPending ? 'Submitting…' : 'Request nursing care'}
                  onPress={handleSubmit}
                  disabled={createVisit.isPending}
                  loading={createVisit.isPending}
                />
              )}
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  progressWrap: { marginBottom: 16 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontFamily: fonts.medium, fontSize: 11, color: colors.textMuted },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.teal600, borderRadius: 3 },
  errorText: { color: colors.danger, fontSize: 13, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  actionButton: { flex: 1 },
});
