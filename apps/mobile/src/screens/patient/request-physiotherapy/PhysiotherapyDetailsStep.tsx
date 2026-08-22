import { StyleSheet, Text, View } from 'react-native';
import { MOBILITY_LEVEL_LABELS, MobilityLevel, PHYSIOTHERAPY_CONDITION_LABELS, PhysiotherapyConditionType } from '@ghar-doc/shared';
import { Field } from '../../../components/Field';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from '../Pill';
import type { PhysiotherapyWizardState } from './types';

const CONDITION_TYPES = Object.values(PhysiotherapyConditionType);
const MOBILITY_LEVELS = Object.values(MobilityLevel);

export function PhysiotherapyDetailsStep({
  state,
  onChange,
  errors,
}: {
  state: PhysiotherapyWizardState;
  onChange: (patch: Partial<PhysiotherapyWizardState>) => void;
  errors: Partial<Record<'conditionType' | 'otherConditionText' | 'mobilityLevel', string>>;
}) {
  return (
    <View>
      <Text style={styles.title}>Tell us about the condition</Text>

      <Text style={styles.sectionLabel}>What's the condition?</Text>
      <View style={styles.pillRow}>
        {CONDITION_TYPES.map((type) => (
          <Pill
            key={type}
            label={PHYSIOTHERAPY_CONDITION_LABELS[type]}
            active={state.conditionType === type}
            onPress={() => onChange({ conditionType: type })}
          />
        ))}
      </View>
      {errors.conditionType ? <Text style={styles.errorText}>{errors.conditionType}</Text> : null}

      {state.conditionType === 'OTHER' && (
        <Field
          label="Describe the condition"
          value={state.otherConditionText}
          onChangeText={(v) => onChange({ otherConditionText: v })}
          error={errors.otherConditionText}
        />
      )}

      <Text style={styles.sectionLabel}>Current mobility level</Text>
      <View style={styles.pillRow}>
        {MOBILITY_LEVELS.map((level) => (
          <Pill
            key={level}
            label={MOBILITY_LEVEL_LABELS[level]}
            active={state.mobilityLevel === level}
            onPress={() => onChange({ mobilityLevel: level })}
          />
        ))}
      </View>
      {errors.mobilityLevel ? <Text style={styles.errorText}>{errors.mobilityLevel}</Text> : null}

      <Field
        label="What would you like this session to achieve? (optional)"
        value={state.sessionGoal}
        onChangeText={(v) => onChange({ sessionGoal: v })}
        multiline
        placeholder="e.g. reduce pain, rebuild strength after surgery, improve walking"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  sectionLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text, marginBottom: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: -4, marginBottom: 10 },
});
