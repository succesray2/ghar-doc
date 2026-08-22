import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SAFETY_NET_QUESTIONS, type SafetyNetAnswers } from '@ghar-doc/shared';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';

/** Shared by the Nursing and Physiotherapy wizards — a small, universal
 *  red-flag check, NOT the doctor triage engine. Any "yes" hard-blocks with
 *  no acknowledge-and-proceed option; the only way forward is the doctor
 *  request flow instead. */
export function SafetyNetCheckStep({
  answers,
  onChange,
  onRequestDoctor,
}: {
  answers: SafetyNetAnswers;
  onChange: (patch: Partial<SafetyNetAnswers>) => void;
  onRequestDoctor: () => void;
}) {
  const triggered = Object.values(answers).some(Boolean);

  if (triggered) {
    return (
      <View style={styles.blockCard}>
        <Text style={styles.blockTitle}>This needs a doctor, not a routine booking</Text>
        <Text style={styles.blockBody}>
          Based on what you've flagged, please request a doctor visit instead — a nurse or physiotherapist booking isn't the right
          fit for this right now.
        </Text>
        <Button title="Request a doctor visit" onPress={onRequestDoctor} />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Quick safety check</Text>
      <Text style={styles.subtitle}>Before continuing, please confirm none of the following apply right now.</Text>
      <View style={styles.list}>
        {SAFETY_NET_QUESTIONS.map((q) => (
          <Pressable key={q.id} style={styles.row} onPress={() => onChange({ [q.id]: !answers[q.id] })}>
            <MaterialCommunityIcons
              name={answers[q.id] ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={22}
              color={answers[q.id] ? colors.teal600 : colors.ink400}
            />
            <Text style={styles.rowLabel}>{q.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  list: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 10 },
  rowLabel: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  blockCard: { borderRadius: 14, borderWidth: 1, borderColor: colors.dangerBg, backgroundColor: colors.dangerBg, padding: 16, gap: 12 },
  blockTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.danger },
  blockBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, lineHeight: 19 },
});
