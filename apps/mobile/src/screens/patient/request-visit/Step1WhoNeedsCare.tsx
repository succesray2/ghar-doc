import { StyleSheet, Text, View } from 'react-native';
import type { BookingRelation } from '@ghar-doc/shared';
import { Field } from '../../../components/Field';
import { colors, fonts } from '../../../theme/colors';
import { Pill } from './Pill';
import type { WizardState } from './types';

const RELATIONS: { value: BookingRelation; label: string }[] = [
  { value: 'SELF', label: 'Myself' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'CHILD', label: 'Child' },
  { value: 'OTHER_FAMILY', label: 'Other family member' },
];

export function Step1WhoNeedsCare({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
}) {
  const isSomeoneElse = state.bookingFor !== 'SELF';

  return (
    <View>
      <Text style={styles.title}>Who needs the doctor?</Text>
      <View style={styles.pillRow}>
        {RELATIONS.map((r) => (
          <Pill key={r.value} label={r.label} active={state.bookingFor === r.value} onPress={() => onChange({ bookingFor: r.value })} />
        ))}
      </View>

      {isSomeoneElse && (
        <View style={styles.subCard}>
          <Text style={styles.subCardHint}>A few details about who this visit is for, and how the doctor can reach you.</Text>
          <Field label="Patient's name" value={state.patientName} onChangeText={(v) => onChange({ patientName: v })} />
          <Field label="Patient's age" value={state.patientAge} onChangeText={(v) => onChange({ patientAge: v })} keyboardType="number-pad" />
          <Field label="Patient's sex (optional)" value={state.patientSex} onChangeText={(v) => onChange({ patientSex: v })} />
          <Field label="Your name (the person booking)" value={state.caregiverName} onChangeText={(v) => onChange({ caregiverName: v })} />
          <Field label="Your phone number" value={state.caregiverPhone} onChangeText={(v) => onChange({ caregiverPhone: v })} keyboardType="phone-pad" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  subCard: { marginTop: 12, padding: 14, borderRadius: 14, backgroundColor: colors.bgSoft },
  subCardHint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 10 },
});
