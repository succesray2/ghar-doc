import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../lib/auth-store';
import { useLogout } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';
import type { PatientTabScreenProps } from '../navigation/types';

type Props = PatientTabScreenProps<'Account'>;

const TERMS_BODY =
  'Placeholder terms of service. Replace with GharDoc’s real terms before launch. By using this app you agree to receive doctor home-visit services arranged through GharDoc, subject to doctor availability and admin assignment.';
const PRIVACY_BODY =
  'Placeholder privacy policy. Replace with GharDoc’s real policy before launch. Your account and visit details are accessible only to you and your assigned care team.';
const REFUND_BODY =
  'Placeholder refund policy. Replace with GharDoc’s real policy before launch — no payment processing is live yet, so no refund scenarios currently apply.';
const ABOUT_BODY =
  'GharDoc brings doctor home visits to your family. Request a visit, and our team assigns a verified doctor to come to you.';
const FAQ_BODY =
  'How do I request a visit? Go to Doctors or Home and tap "Request a visit."\n\nHow is a doctor assigned? An admin reviews your request and assigns an approved, available doctor.\n\nCan I cancel a visit? Yes, from the Visits tab, while it’s still Requested or Assigned.';

export function AccountScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const rootNav = navigation.getParent();

  if (!user) return null;
  const initial = user.firstName?.charAt(0).toUpperCase() ?? '?';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.meta}>{user.email}</Text>
        </View>
        <Pressable onPress={() => rootNav?.navigate('EditProfile')}>
          <Text style={styles.editLink}>Edit</Text>
        </Pressable>
      </Card>

      <Section title="My Health">
        <Row icon="calendar-check-outline" label="Health Records" onPress={() => rootNav?.navigate('HealthRecords')} />
        <Row icon="file-document-outline" label="Diagnostic Reports" onPress={() => rootNav?.navigate('HealthRecords')} />
        <Row icon="book-open-variant" label="Health Guides" onPress={() => rootNav?.navigate('HealthGuides')} last />
      </Section>

      <Section title="My Family & Services">
        <Row icon="account-group-outline" label="Family Members" onPress={() => rootNav?.navigate('FamilyMembers')} />
        <Row icon="shield-star-outline" label="Care Plans" onPress={() => rootNav?.navigate('CarePlans')} />
        <Row icon="map-marker-outline" label="Saved Addresses" onPress={() => rootNav?.navigate('HealthRecords')} last />
      </Section>

      <Section title="Account">
        <Row icon="bell-outline" label="Notifications" onPress={() => rootNav?.navigate('Notifications')} />
        <Row icon="cog-outline" label="Settings" onPress={() => rootNav?.navigate('StaticInfo', { title: 'Settings', body: 'App settings are coming soon.' })} last />
      </Section>

      <Section title="Help & Legal">
        <Row icon="lifebuoy" label="Support" onPress={() => rootNav?.navigate('Support')} />
        <Row icon="help-circle-outline" label="FAQs" onPress={() => rootNav?.navigate('StaticInfo', { title: 'FAQs', body: FAQ_BODY })} />
        <Row icon="file-document-edit-outline" label="Terms & Conditions" onPress={() => rootNav?.navigate('StaticInfo', { title: 'Terms & Conditions', body: TERMS_BODY })} />
        <Row icon="shield-lock-outline" label="Privacy Policy" onPress={() => rootNav?.navigate('StaticInfo', { title: 'Privacy Policy', body: PRIVACY_BODY })} />
        <Row icon="cash-refund" label="Refund Policy" onPress={() => rootNav?.navigate('StaticInfo', { title: 'Refund Policy', body: REFUND_BODY })} />
        <Row icon="information-outline" label="About GharDoc" onPress={() => rootNav?.navigate('StaticInfo', { title: 'About GharDoc', body: ABOUT_BODY })} last />
      </Section>

      <View style={styles.logoutWrap}>
        <Button
          title={logout.isPending ? 'Logging out…' : 'Log out'}
          variant="danger"
          onPress={() => logout.mutate()}
          disabled={logout.isPending}
          loading={logout.isPending}
        />
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Card style={styles.sectionCard}>{children}</Card>
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  last,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.rowBorder]}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.navy700} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Feather name="chevron-right" size={18} color={colors.ink400} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  headerCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.navy700, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bold, color: '#fff', fontSize: 20 },
  headerInfo: { flex: 1 },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink900 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
  editLink: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.teal600 },
  section: { marginTop: 18 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink400, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  sectionCard: { padding: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowIcon: { marginRight: 12 },
  rowLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink900 },
  logoutWrap: { marginTop: 24 },
});
