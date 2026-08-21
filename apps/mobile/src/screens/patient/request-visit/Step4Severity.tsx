import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  ABDOMINAL_PAIN_IDS,
  ASSOCIATED_SIGN_QUESTIONS,
  BODY_REGION_OPTIONS,
  BP_EXTREME_IDS,
  DIABETES_CATEGORY_IDS,
  FEVER_IDS,
  SEVERITY_LABELS,
  SeverityOption,
  SYMPTOM_CATEGORIES,
  type SeverityOption as SeverityOptionType,
} from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from './Pill';
import type { SymptomDetail, WizardState } from './types';

const SEVERITY_ICON: Record<SeverityOptionType, string> = {
  MILD: '🟢',
  MODERATE: '🟡',
  SEVERE: '🔴',
  VERY_SEVERE: '🔴',
  NOT_SURE: '❓',
};

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

export function Step4Severity({
  state,
  onUpdateDetail,
  onSetSign,
}: {
  state: WizardState;
  onUpdateDetail: (symptomId: string, patch: Partial<SymptomDetail>) => void;
  onSetSign: (symptomId: string, signId: string, value: boolean) => void;
}) {
  const symptomsWithQuestions = state.selectedSymptomIds.filter((id) => ASSOCIATED_SIGN_QUESTIONS[id]);
  const hasDiabetesSymptom = state.selectedSymptomIds.some((id) => DIABETES_CATEGORY_IDS.includes(id));
  const firstDiabetesId = state.selectedSymptomIds.find((id) => DIABETES_CATEGORY_IDS.includes(id));

  return (
    <View>
      <Text style={styles.title}>How severe is it?</Text>

      {state.selectedSymptomIds.map((symptomId) => {
        const detail = state.symptomDetails[symptomId];
        return (
          <View key={symptomId} style={styles.card}>
            <Text style={styles.symptomLabel}>{symptomLabel(symptomId)}</Text>

            <View style={styles.pillRow}>
              {Object.values(SeverityOption)
                .filter((o) => o !== 'VERY_SEVERE')
                .map((opt) => (
                  <Pill
                    key={opt}
                    label={`${SEVERITY_ICON[opt]} ${SEVERITY_LABELS[opt]}`}
                    active={detail?.severity === opt}
                    onPress={() => onUpdateDetail(symptomId, { severity: opt })}
                  />
                ))}
            </View>

            {ABDOMINAL_PAIN_IDS.includes(symptomId) && (
              <View>
                <Text style={styles.sectionLabel}>Where is the pain?</Text>
                <View style={styles.pillRow}>
                  {BODY_REGION_OPTIONS.map((r) => (
                    <Pill key={r.id} label={r.label} active={detail?.bodyRegion === r.id} onPress={() => onUpdateDetail(symptomId, { bodyRegion: r.id })} />
                  ))}
                </View>
              </View>
            )}

            {FEVER_IDS.includes(symptomId) && (
              <View>
                <Text style={styles.sectionLabel}>Temperature (optional)</Text>
                <View style={styles.readingRow}>
                  <TextInput
                    style={styles.readingInput}
                    keyboardType="numeric"
                    value={detail?.numericReadings?.temperature != null ? String(detail.numericReadings.temperature) : ''}
                    onChangeText={(v) => onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, temperature: v ? Number(v) : undefined } })}
                  />
                  {(['C', 'F'] as const).map((unit) => (
                    <Pill
                      key={unit}
                      label={`°${unit}`}
                      active={detail?.numericReadings?.temperatureUnit === unit}
                      onPress={() => onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, temperatureUnit: unit } })}
                    />
                  ))}
                </View>
              </View>
            )}

            {BP_EXTREME_IDS.includes(symptomId) && (
              <View>
                <Text style={styles.sectionLabel}>Blood pressure reading (optional)</Text>
                <View style={styles.readingRow}>
                  <TextInput
                    style={styles.readingInput}
                    keyboardType="numeric"
                    placeholder="Systolic"
                    placeholderTextColor={colors.textMuted}
                    value={detail?.numericReadings?.systolic != null ? String(detail.numericReadings.systolic) : ''}
                    onChangeText={(v) => onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, systolic: v ? Number(v) : undefined } })}
                  />
                  <TextInput
                    style={styles.readingInput}
                    keyboardType="numeric"
                    placeholder="Diastolic"
                    placeholderTextColor={colors.textMuted}
                    value={detail?.numericReadings?.diastolic != null ? String(detail.numericReadings.diastolic) : ''}
                    onChangeText={(v) => onUpdateDetail(symptomId, { numericReadings: { ...detail?.numericReadings, diastolic: v ? Number(v) : undefined } })}
                  />
                </View>
              </View>
            )}
          </View>
        );
      })}

      {hasDiabetesSymptom && (
        <View style={styles.card}>
          <Text style={styles.symptomLabel}>Does the patient have known diabetes?</Text>
          <View style={styles.pillRow}>
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map((opt) => (
              <Pill
                key={opt.label}
                label={opt.label}
                active={firstDiabetesId ? state.symptomDetails[firstDiabetesId]?.knownCondition === opt.value : false}
                onPress={() =>
                  state.selectedSymptomIds
                    .filter((id) => DIABETES_CATEGORY_IDS.includes(id))
                    .forEach((id) => onUpdateDetail(id, { knownCondition: opt.value }))
                }
              />
            ))}
          </View>
        </View>
      )}

      {symptomsWithQuestions.length > 0 && (
        <View>
          <Text style={styles.moreQuestionsTitle}>A few more questions</Text>
          {symptomsWithQuestions.map((symptomId) => {
            const questions = ASSOCIATED_SIGN_QUESTIONS[symptomId];
            const detail = state.symptomDetails[symptomId];
            return (
              <View key={symptomId} style={styles.card}>
                <Text style={styles.symptomLabel}>About the {symptomLabel(symptomId).toLowerCase()}</Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  symptomLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 10 },
  sectionLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6, marginTop: 10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  readingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  readingInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minHeight: 38,
    minWidth: 80,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.card,
  },
  moreQuestionsTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: 10, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, minHeight: 40 },
  question: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginRight: 8 },
  answerButtons: { flexDirection: 'row', gap: 6 },
  answerBtn: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8, minHeight: 38, justifyContent: 'center' },
  answerBtnYes: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  answerBtnNo: { borderColor: colors.teal600, backgroundColor: colors.teal100 },
  answerText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textMuted },
  answerTextYes: { color: colors.danger },
  answerTextNo: { color: colors.brand700 },
});
