import { StyleSheet, Text, View } from 'react-native';
import { Field } from '../../../components/Field';
import { colors, fonts } from '../../../theme/colors';
import type { WizardState } from './types';

export function Step6AddressSubmit({
  state,
  onChange,
  errors,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  errors: Partial<Record<'addressLine1' | 'city' | 'state' | 'postalCode', string>>;
}) {
  return (
    <View>
      <Text style={styles.title}>Where should the doctor come?</Text>
      <Field label="Additional notes (optional)" value={state.notes} onChangeText={(v) => onChange({ notes: v })} multiline />
      <Field label="Address line 1" value={state.addressLine1} onChangeText={(v) => onChange({ addressLine1: v })} error={errors.addressLine1} />
      <Field label="Address line 2 (optional)" value={state.addressLine2} onChangeText={(v) => onChange({ addressLine2: v })} />
      <Field label="City" value={state.city} onChangeText={(v) => onChange({ city: v })} error={errors.city} />
      <Field label="State" value={state.state} onChangeText={(v) => onChange({ state: v })} error={errors.state} />
      <Field label="Postal code" value={state.postalCode} onChangeText={(v) => onChange({ postalCode: v })} keyboardType="number-pad" error={errors.postalCode} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
});
