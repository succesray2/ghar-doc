import { StyleSheet, Text, View } from 'react-native';
import {
  DURATION_LABELS,
  DurationOption,
  SEVERITY_LABELS,
  SeverityOption,
  SYMPTOM_CATEGORIES,
  type DurationOption as DurationOptionType,
  type SeverityOption as SeverityOptionType,
} from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from './Pill';
import type { WizardState } from './types';

const SEVERITY_ICON: Record<SeverityOptionType, string> = {
  MILD: '🟢',
  MODERATE: '🟡',
  SEVERE: '🔴',
  NOT_SURE: '❓',
};

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step3DurationSeverity({
  state,
  onUpdateDetail,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<{ duration: DurationOptionType; severity: SeverityOptionType }>) => void;
}) {
  return (
    <View>
      <Text style={styles.title}>How long, and how severe?</Text>
      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <View key={symptomId} style={styles.card}>
            <Text style={styles.symptomLabel}>{symptomLabel(symptomId)}</Text>

            <Text style={styles.sectionLabel}>Duration</Text>
            <View style={styles.pillRow}>
              {Object.values(DurationOption).map((opt) => (
                <Pill key={opt} label={DURATION_LABELS[opt]} active={detail?.duration === opt} onPress={() => onUpdateDetail(symptomId, { duration: opt })} />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Severity</Text>
            <View style={styles.pillRow}>
              {Object.values(SeverityOption).map((opt) => (
                <Pill
                  key={opt}
                  label={`${SEVERITY_ICON[opt]} ${SEVERITY_LABELS[opt]}`}
                  active={detail?.severity === opt}
                  onPress={() => onUpdateDetail(symptomId, { severity: opt })}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  symptomLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 10 },
  sectionLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6, marginTop: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
