import { StyleSheet, Text, View } from 'react-native';
import { SYMPTOM_CATEGORIES, TRIAGE_MESSAGES, type TriageResult } from '@ghar-doc/shared';
import { colors, fonts } from '../../../theme/colors';
import type { WizardState } from './types';

const symptomLabel = (id: string) => SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms).find((s) => s.id === id)?.label ?? id;

const RELATION_LABEL: Record<WizardState['bookingFor'], string> = {
  SELF: 'Myself',
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER_FAMILY: 'Other family member',
};

const PRIORITY_LABEL: Record<'RED' | 'ORANGE' | 'GREEN', string> = {
  RED: 'Urgent — reviewed by you already',
  ORANGE: 'Priority assessment',
  GREEN: 'Routine home visit',
};

export function Step7DoctorRequest({ state, result }: { state: WizardState; result: TriageResult | null }) {
  return (
    <View>
      <Text style={styles.title}>Confirm your request</Text>
      <Text style={styles.subtitle}>
        A GharDoc doctor will review this request. Your final clinical assessment always comes from them, not this form.
      </Text>

      <View style={styles.card}>
        <Row label="For">
          {RELATION_LABEL[state.bookingFor]}
          {state.bookingFor !== 'SELF' && state.patientName ? ` — ${state.patientName}` : ''}
        </Row>
        <Row label="Symptoms">{[...state.selectedSymptomIds.map(symptomLabel), state.otherSymptomText].filter(Boolean).join(', ')}</Row>
        <Row label="Address">{[state.addressLine1, state.addressLine2, state.city, state.state, state.postalCode].filter(Boolean).join(', ')}</Row>
        {result ? <Row label="Priority">{PRIORITY_LABEL[result.priority]}</Row> : null}
      </View>

      {result && result.priority !== 'GREEN' ? <Text style={styles.note}>{TRIAGE_MESSAGES[result.priority]}</Text> : null}

      <Text style={styles.footNote}>
        Requesting a visit does not dispatch a doctor automatically — an admin reviews and assigns one, and you&apos;ll see updates
        on My Visits.
      </Text>
    </View>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 14 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, gap: 10 },
  row: {},
  rowLabel: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  rowValue: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 12 },
  footNote: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 14 },
});
