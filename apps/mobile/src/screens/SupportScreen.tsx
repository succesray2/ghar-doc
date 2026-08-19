import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { colors, fonts } from '../theme/colors';

// Same placeholder contact info as apps/marketing/src/data/content.ts — kept
// in sync deliberately, not invented separately. Replace both before launch.
const CONTACT = {
  phoneDisplay: '+91 90000 00000',
  phoneHref: 'tel:+919000000000',
  email: 'care@ghardoc.com',
  officeHours: 'Mon–Sun, 7:00 AM – 10:00 PM',
};

export function SupportScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Need help?</Text>
      <Text style={styles.subtitle}>{CONTACT.officeHours}</Text>

      <ContactRow
        icon="phone"
        label="Call us"
        value={CONTACT.phoneDisplay}
        onPress={() => Linking.openURL(CONTACT.phoneHref)}
        highlight
      />
      <ContactRow
        icon="mail"
        label="Email support"
        value={CONTACT.email}
        onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)}
      />

      <Card style={styles.emergencyCard}>
        <View style={styles.emergencyRow}>
          <Feather name="alert-triangle" size={20} color={colors.danger} />
          <Text style={styles.emergencyTitle}>Medical emergency?</Text>
        </View>
        <Text style={styles.emergencyText}>
          Don't wait for an app. Call <Text style={styles.emergencyNumber}>108</Text> (India's national ambulance
          number) for immediate help.
        </Text>
      </Card>
    </ScrollView>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
  highlight,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={[styles.rowCard, highlight && styles.rowCardHighlight]}>
        <View style={[styles.rowIcon, highlight && styles.rowIconHighlight]}>
          <Feather name={icon} size={18} color={highlight ? '#fff' : colors.brand600} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, highlight && styles.rowLabelHighlight]}>{label}</Text>
          <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={highlight ? 'rgba(255,255,255,0.8)' : colors.textMuted} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 20 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowCardHighlight: { backgroundColor: colors.navy700 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconHighlight: { backgroundColor: 'rgba(255,255,255,0.2)' },
  rowText: { flex: 1 },
  rowLabel: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.text },
  rowLabelHighlight: { color: '#fff' },
  rowValue: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  rowValueHighlight: { color: 'rgba(255,255,255,0.85)' },
  emergencyCard: { borderWidth: 1, borderColor: colors.dangerBg, backgroundColor: colors.dangerBg, marginTop: 12 },
  emergencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  emergencyTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.danger },
  emergencyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  emergencyNumber: { fontFamily: fonts.extraBold, color: colors.danger },
});
