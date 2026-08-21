import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SYMPTOM_CATEGORIES, TRIAGE_MESSAGES, type TriageResult } from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

const TONE: Record<'RED' | 'ORANGE' | 'GREEN', { bg: string; border: string; text: string }> = {
  RED: { bg: colors.dangerBg, border: colors.danger, text: colors.danger },
  ORANGE: { bg: '#fef3c7', border: '#d97706', text: '#92400e' },
  GREEN: { bg: colors.teal100, border: colors.teal600, text: colors.brand700 },
};

export function Step5Review({
  state,
  result,
  isLoading,
  acknowledged,
  onAcknowledgeChange,
}: {
  state: WizardState;
  result: TriageResult | null;
  isLoading: boolean;
  acknowledged: boolean;
  onAcknowledgeChange: (value: boolean) => void;
}) {
  const symptomText = [...state.selectedSymptomIds.map(symptomLabel), state.otherSymptomText].filter(Boolean).join(', ');

  return (
    <View>
      <Text style={styles.title}>Review</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Symptoms selected</Text>
        <Text style={styles.cardBody}>{symptomText}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.teal600} style={{ marginTop: 12 }} />
      ) : result ? (
        <View style={[styles.resultCard, { backgroundColor: TONE[result.priority].bg, borderColor: TONE[result.priority].border }]}>
          <Text style={[styles.resultMessage, { color: TONE[result.priority].text }]}>{TRIAGE_MESSAGES[result.priority]}</Text>
          <Text style={styles.disclaimer}>
            This is a service-prioritization signal, not a diagnosis. A GharDoc doctor is responsible for your actual clinical
            assessment.
          </Text>

          {result.priority === 'RED' && (
            <View style={styles.redSection}>
              <Text style={styles.redTitle}>Don&apos;t wait for an app — call for immediate help.</Text>
              <Pressable style={styles.callButton} onPress={() => Linking.openURL('tel:108')}>
                <Feather name="phone-call" size={16} color="#fff" />
                <Text style={styles.callButtonText}>Call 108 (Ambulance)</Text>
              </Pressable>
              <Text style={styles.redHint}>
                108 is India&apos;s free, nationwide emergency ambulance service — available 24/7, independent of GharDoc.
              </Text>
              <Pressable style={styles.ackRow} onPress={() => onAcknowledgeChange(!acknowledged)}>
                <Feather name={acknowledged ? 'check-square' : 'square'} size={18} color={acknowledged ? colors.danger : colors.textMuted} />
                <Text style={styles.ackText}>
                  I understand this may need urgent medical care, and I want to continue with a routine GharDoc home-visit request
                  anyway.
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}

      <Text style={styles.footNote}>Not sure if this is an emergency? When in doubt, call 108.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  cardBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  resultCard: { borderWidth: 1, borderRadius: 14, padding: 14 },
  resultMessage: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20 },
  disclaimer: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 8 },
  redSection: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.danger, gap: 10 },
  redTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.danger },
  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.danger, borderRadius: 999, paddingVertical: 12, alignSelf: 'flex-start', paddingHorizontal: 18 },
  callButtonText: { fontFamily: fonts.semiBold, fontSize: 14, color: '#fff' },
  redHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  ackRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  ackText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.text, lineHeight: 18 },
  footNote: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 14 },
});
