import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ASSOCIATED_SIGN_QUESTIONS, SYMPTOM_CATEGORIES } from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step4AssociatedSigns({
  state,
  onSetSign,
}: {
  state: WizardState;
  onSetSign: (symptomId: string, signId: string, value: boolean) => void;
}) {
  const symptomsWithQuestions = state.selectedSymptomIds.filter((id) => ASSOCIATED_SIGN_QUESTIONS[id]);

  if (symptomsWithQuestions.length === 0) {
    return (
      <View>
        <Text style={styles.title}>Any warning signs?</Text>
        <Text style={styles.hint}>No additional questions for the symptoms you selected — continue to review.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Any warning signs?</Text>
      {symptomsWithQuestions.map((symptomId) => {
        const questions = ASSOCIATED_SIGN_QUESTIONS[symptomId];
        const detail = state.symptomDetails[symptomId];
        return (
          <View key={symptomId} style={styles.card}>
            <Text style={styles.symptomLabel}>About your {symptomLabel(symptomId).toLowerCase()}</Text>
            {questions.map((q) => {
              const value = detail?.associatedSigns?.[q.id];
              return (
                <View key={q.id} style={styles.row}>
                  <Text style={styles.question}>{q.label}</Text>
                  <View style={styles.answerButtons}>
                    <Pressable
                      style={[styles.answerBtn, value === true && styles.answerBtnYes]}
                      onPress={() => onSetSign(symptomId, q.id, true)}
                    >
                      <Text style={[styles.answerText, value === true && styles.answerTextYes]}>Yes</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.answerBtn, value === false && styles.answerBtnNo]}
                      onPress={() => onSetSign(symptomId, q.id, false)}
                    >
                      <Text style={[styles.answerText, value === false && styles.answerTextNo]}>No</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  symptomLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 7 },
  question: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginRight: 8 },
  answerButtons: { flexDirection: 'row', gap: 6 },
  answerBtn: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 5 },
  answerBtnYes: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  answerBtnNo: { borderColor: colors.teal600, backgroundColor: colors.teal100 },
  answerText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textMuted },
  answerTextYes: { color: colors.danger },
  answerTextNo: { color: colors.brand700 },
});
