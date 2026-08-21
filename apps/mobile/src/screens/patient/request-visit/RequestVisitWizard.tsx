import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SYMPTOM_CATEGORIES, type CreateVisitInput, type TriageResult } from '@ghar-doc/shared';
import { useCreateVisit, useTriagePreview } from '../../../hooks/useVisits';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { colors, fonts } from '../../../theme/colors';
import type { PatientStackParamList } from '../../../navigation/types';
import { Step1WhoNeedsCare } from './Step1WhoNeedsCare';
import { Step2Symptoms } from './Step2Symptoms';
import { Step3DurationSeverity } from './Step3DurationSeverity';
import { Step4AssociatedSigns } from './Step4AssociatedSigns';
import { Step5Review } from './Step5Review';
import { Step6AddressSubmit } from './Step6AddressSubmit';
import { INITIAL_WIZARD_STATE, type WizardState } from './types';

type Props = NativeStackScreenProps<PatientStackParamList, 'RequestVisit'>;

const STEP_TITLES = ['Who needs care', 'Symptoms', 'Duration & severity', 'Warning signs', 'Review', 'Address'];
const TOTAL_STEPS = STEP_TITLES.length;

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function RequestVisitScreen({ navigation, route }: Props) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [acknowledged, setAcknowledged] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const triagePreview = useTriagePreview();
  const createVisit = useCreateVisit();

  useEffect(() => {
    if (route.params?.reasonHint && !state.otherSymptomText) {
      setState((s) => ({ ...s, otherSymptomText: route.params?.reasonHint ?? '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.reasonHint]);

  const update = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  const toggleSymptom = (symptomId: string) => {
    setState((s) => {
      const already = s.selectedSymptomIds.includes(symptomId);
      const selectedSymptomIds = already ? s.selectedSymptomIds.filter((id) => id !== symptomId) : [...s.selectedSymptomIds, symptomId];
      const symptomDetails = { ...s.symptomDetails };
      if (already) delete symptomDetails[symptomId];
      else symptomDetails[symptomId] = { associatedSigns: {} };
      return { ...s, selectedSymptomIds, symptomDetails };
    });
  };

  const updateDetail: React.ComponentProps<typeof Step3DurationSeverity>['onUpdateDetail'] = (symptomId, patch) => {
    setState((s) => ({
      ...s,
      symptomDetails: {
        ...s.symptomDetails,
        [symptomId]: { ...s.symptomDetails[symptomId], ...patch, associatedSigns: s.symptomDetails[symptomId]?.associatedSigns ?? {} },
      },
    }));
  };

  const setSign = (symptomId: string, signId: string, value: boolean) => {
    setState((s) => ({
      ...s,
      symptomDetails: {
        ...s.symptomDetails,
        [symptomId]: {
          ...s.symptomDetails[symptomId],
          associatedSigns: { ...s.symptomDetails[symptomId]?.associatedSigns, [signId]: value },
        },
      },
    }));
  };

  const triageAnswers = {
    symptoms: state.selectedSymptomIds.map((symptomId) => ({
      symptomId,
      duration: state.symptomDetails[symptomId]?.duration,
      severity: state.symptomDetails[symptomId]?.severity,
      associatedSigns: state.symptomDetails[symptomId]?.associatedSigns,
    })),
    otherSymptomText: state.otherSymptomText || undefined,
  };

  useEffect(() => {
    if (step === 5) {
      setAcknowledged(false);
      triagePreview.mutate(triageAnswers, { onSuccess: (data) => setTriageResult(data) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canProceed = (): boolean => {
    if (step === 2) return state.selectedSymptomIds.length > 0 || state.otherSymptomText.trim().length > 0;
    if (step === 5) return triageResult !== null && (triageResult.priority !== 'RED' || acknowledged);
    return true;
  };

  const handleSubmit = () => {
    setSubmitError(null);
    const errors: Record<string, string> = {};
    if (!state.addressLine1.trim()) errors.addressLine1 = 'Required';
    if (!state.city.trim()) errors.city = 'Required';
    if (!state.state.trim()) errors.state = 'Required';
    if (!state.postalCode.trim()) errors.postalCode = 'Required';
    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const reasonForVisit =
      [...state.selectedSymptomIds.map(symptomLabel), state.otherSymptomText].filter(Boolean).join(', ') || 'Home visit request';

    const payload: CreateVisitInput = {
      reasonForVisit,
      notes: state.notes || undefined,
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
      triageAnswers,
      redFlagAcknowledged: acknowledged,
    };

    createVisit.mutate(payload, {
      onSuccess: () => {
        setState(INITIAL_WIZARD_STATE);
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
              <Text style={styles.progressText}>
                Step {step} of {TOTAL_STEPS}
              </Text>
              <Text style={styles.progressText}>{STEP_TITLES[step - 1]}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
            </View>
          </View>

          {step === 1 && <Step1WhoNeedsCare state={state} onChange={update} />}
          {step === 2 && <Step2Symptoms state={state} onToggleSymptom={toggleSymptom} onChange={update} />}
          {step === 3 && <Step3DurationSeverity state={state} onUpdateDetail={updateDetail} />}
          {step === 4 && <Step4AssociatedSigns state={state} onSetSign={setSign} />}
          {step === 5 && (
            <Step5Review
              state={state}
              result={triageResult}
              isLoading={triagePreview.isPending}
              acknowledged={acknowledged}
              onAcknowledgeChange={setAcknowledged}
            />
          )}
          {step === 6 && <Step6AddressSubmit state={state} onChange={update} errors={addressErrors} />}

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          <View style={styles.actions}>
            {step > 1 && (
              <View style={styles.actionButton}>
                <Button title="Back" variant="secondary" onPress={() => setStep((s) => Math.max(1, s - 1))} />
              </View>
            )}
            <View style={styles.actionButton}>
              {step < TOTAL_STEPS ? (
                <Button title="Next" onPress={() => setStep((s) => s + 1)} disabled={!canProceed()} />
              ) : (
                <Button
                  title={createVisit.isPending ? 'Submitting…' : 'Request visit'}
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
