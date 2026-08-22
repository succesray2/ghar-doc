import { StyleSheet, Text, View } from 'react-native';
import { NURSING_SERVICE_LABELS, NursingServiceType } from '@ghar-doc/shared';
import { Field } from '../../../components/Field';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from '../Pill';
import type { NursingWizardState } from './types';

const SERVICE_TYPES = Object.values(NursingServiceType);

export function NursingDetailsStep({
  state,
  onChange,
  errors,
}: {
  state: NursingWizardState;
  onChange: (patch: Partial<NursingWizardState>) => void;
  errors: Partial<Record<'nursingServiceType' | 'otherServiceText', string>>;
}) {
  return (
    <View>
      <Text style={styles.title}>What nursing care do you need?</Text>
      <View style={styles.pillRow}>
        {SERVICE_TYPES.map((type) => (
          <Pill
            key={type}
            label={NURSING_SERVICE_LABELS[type]}
            active={state.nursingServiceType === type}
            onPress={() => onChange({ nursingServiceType: type })}
          />
        ))}
      </View>
      {errors.nursingServiceType ? <Text style={styles.errorText}>{errors.nursingServiceType}</Text> : null}

      {state.nursingServiceType === 'OTHER' && (
        <Field
          label="Describe what you need"
          value={state.otherServiceText}
          onChangeText={(v) => onChange({ otherServiceText: v })}
          error={errors.otherServiceText}
        />
      )}

      <Field
        label="Care notes (optional)"
        value={state.careNotes}
        onChangeText={(v) => onChange({ careNotes: v })}
        multiline
        placeholder="Anything the nurse should know — e.g. an existing prescription, wound location, allergy"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: -4, marginBottom: 10 },
});
