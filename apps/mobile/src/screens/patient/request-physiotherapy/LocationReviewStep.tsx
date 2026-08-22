import { StyleSheet, Text, View } from 'react-native';
import { PHYSIOTHERAPY_CONDITION_LABELS } from '@ghar-doc/shared';
import { Field } from '../../../components/Field';
import { colors, fonts } from '../../../theme/colors';
import type { PhysiotherapyWizardState } from './types';

const RELATION_LABEL: Record<PhysiotherapyWizardState['bookingFor'], string> = {
  SELF: 'Myself',
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER_FAMILY: 'Other family member',
};

export function LocationReviewStep({
  state,
  onChange,
  errors,
}: {
  state: PhysiotherapyWizardState;
  onChange: (patch: Partial<PhysiotherapyWizardState>) => void;
  errors: Partial<Record<'addressLine1' | 'city' | 'state' | 'postalCode', string>>;
}) {
  return (
    <View>
      <Text style={styles.title}>Location &amp; review</Text>
      <Field label="Address line 1" value={state.addressLine1} onChangeText={(v) => onChange({ addressLine1: v })} error={errors.addressLine1} />
      <Field label="Address line 2 (optional)" value={state.addressLine2} onChangeText={(v) => onChange({ addressLine2: v })} />
      <Field label="City" value={state.city} onChangeText={(v) => onChange({ city: v })} error={errors.city} />
      <Field label="State" value={state.state} onChangeText={(v) => onChange({ state: v })} error={errors.state} />
      <Field label="Postal code" value={state.postalCode} onChangeText={(v) => onChange({ postalCode: v })} keyboardType="number-pad" error={errors.postalCode} />

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>FOR</Text>
        <Text style={styles.summaryValue}>{RELATION_LABEL[state.bookingFor]}{state.bookingFor !== 'SELF' && state.patientName ? ` — ${state.patientName}` : ''}</Text>
        <Text style={[styles.summaryLabel, styles.summarySpacer]}>CONDITION</Text>
        <Text style={styles.summaryValue}>{state.conditionType ? PHYSIOTHERAPY_CONDITION_LABELS[state.conditionType] : '—'}</Text>
      </View>

      <Text style={styles.disclaimer}>
        Requesting physiotherapy does not dispatch a physiotherapist automatically — an admin reviews and assigns one, and you'll
        see updates on My Visits.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 4 },
  summary: { marginTop: 8, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  summaryLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  summaryValue: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginTop: 2 },
  summarySpacer: { marginTop: 10 },
  disclaimer: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400, marginTop: 12, lineHeight: 16 },
});
