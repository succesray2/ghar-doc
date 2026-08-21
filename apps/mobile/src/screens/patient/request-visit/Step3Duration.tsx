import { StyleSheet, Text, View } from 'react-native';
import { DURATION_LABELS, DurationOption, SYMPTOM_CATEGORIES, type DurationOption as DurationOptionType } from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from './Pill';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step3Duration({
  state,
  onUpdateDetail,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<{ duration: DurationOptionType }>) => void;
}) {
  return (
    <View>
      <Text style={styles.title}>When did this start?</Text>
      <Text style={styles.subtitle}>For each symptom, tell us when it started.</Text>
      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <View key={symptomId} style={styles.card}>
            <Text style={styles.symptomLabel}>{symptomLabel(symptomId)}</Text>
            <View style={styles.pillRow}>
              {Object.values(DurationOption).map((opt) => (
                <Pill key={opt} label={DURATION_LABELS[opt]} active={detail?.duration === opt} onPress={() => onUpdateDetail(symptomId, { duration: opt })} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  symptomLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
