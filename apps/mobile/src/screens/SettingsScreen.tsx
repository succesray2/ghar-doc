import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NotificationPreferencesDto } from '@ghar-doc/shared';
import { useAuthStore } from '../lib/auth-store';
import { useChangePassword, useLogoutAllDevices, useSessions } from '../hooks/useProfile';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/useNotifications';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';
import { TERMS_AND_CONDITIONS } from '../data/legal';
import { PRIVACY_POLICY } from '../data/privacy';

const ABOUT_BODY =
  'GharDoc brings doctor home visits to your family. Request a visit, and our team assigns a verified doctor to come to you.';

const PREFERENCE_LABELS: { key: keyof NotificationPreferencesDto; label: string; description: string }[] = [
  { key: 'bookingUpdates', label: 'Booking updates', description: 'Request received, reassignment, and other booking status changes' },
  { key: 'providerAssignment', label: 'Provider assignment', description: 'When a provider is assigned to or accepts your visit' },
  { key: 'providerArrival', label: 'Provider arrival', description: 'When your provider arrives' },
  { key: 'serviceUpdates', label: 'Service updates', description: 'Updates about the service itself' },
  { key: 'paymentUpdates', label: 'Payment updates', description: 'Payment-related notifications' },
  { key: 'generalNotifications', label: 'General', description: 'Everything else from GharDoc' },
];

// Registered on the Patient, Doctor, and Admin stacks — typed against just
// the navigation methods it calls rather than one specific ParamList.
interface Props {
  navigation: {
    navigate: ((screen: 'EditProfile' | 'Support') => void) & ((screen: 'StaticInfo', params: { title: string; body: string }) => void);
  };
}

export function SettingsScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const showNotificationPrefs = user?.role === 'PATIENT' || user?.role === 'DOCTOR';
  const showLegalSupport = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      {showLegalSupport ? (
        <Section title="Profile">
          <Row icon="account-edit-outline" label="Edit profile" onPress={() => navigation.navigate('EditProfile')} last />
        </Section>
      ) : null}

      <SecuritySection />

      {showNotificationPrefs ? <NotificationPreferencesSection /> : null}

      {showLegalSupport ? (
        <Section title="Help & Legal">
          <Row icon="lifebuoy" label="Support" onPress={() => navigation.navigate('Support')} />
          <Row
            icon="file-document-edit-outline"
            label="Terms & Conditions"
            onPress={() => navigation.navigate('StaticInfo', { title: 'Terms & Conditions', body: TERMS_AND_CONDITIONS })}
          />
          <Row
            icon="shield-lock-outline"
            label="Privacy Policy"
            onPress={() => navigation.navigate('StaticInfo', { title: 'Privacy Policy', body: PRIVACY_POLICY })}
          />
          <Row
            icon="information-outline"
            label="About GharDoc"
            onPress={() => navigation.navigate('StaticInfo', { title: 'About GharDoc', body: ABOUT_BODY })}
            last
          />
        </Section>
      ) : null}
    </ScrollView>
  );
}

function SecuritySection() {
  const changePassword = useChangePassword();
  const logoutAll = useLogoutAllDevices();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const submit = () => {
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
        },
      },
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security</Text>
      <Card>
        <Text style={styles.cardHeading}>Change password</Text>
        <Field label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
        <Field label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry hint="At least 8 characters" />
        {changePassword.isError ? (
          <Text style={styles.errorText}>Could not change password — check your current password and try again.</Text>
        ) : null}
        <Text style={styles.hintText}>Changing your password signs you out everywhere, including this device.</Text>
        <Button
          title={changePassword.isPending ? 'Updating…' : 'Change password'}
          onPress={submit}
          disabled={changePassword.isPending || currentPassword.length === 0 || newPassword.length < 8}
          loading={changePassword.isPending}
        />
      </Card>

      <Card>
        <View style={styles.sessionsHeader}>
          <Text style={styles.cardHeading}>Active sessions</Text>
        </View>
        {sessionsLoading ? (
          <ActivityIndicator color={colors.brand600} />
        ) : !sessions || sessions.length === 0 ? (
          <Text style={styles.hintText}>No active sessions.</Text>
        ) : (
          sessions.map((s) => (
            <View key={s.id} style={styles.sessionRow}>
              <Text style={styles.sessionDevice} numberOfLines={1}>{s.userAgent ?? 'Unknown device'}</Text>
              <Text style={styles.sessionDate}>{new Date(s.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
        <View style={styles.logoutAllWrap}>
          <Button
            title="Log out all devices"
            variant="secondary"
            onPress={() =>
              Alert.alert('Log out all devices?', 'You will need to sign in again on every device, including this one.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out all', style: 'destructive', onPress: () => logoutAll.mutate() },
              ])
            }
            disabled={logoutAll.isPending}
            loading={logoutAll.isPending}
          />
        </View>
      </Card>
    </View>
  );
}

function NotificationPreferencesSection() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <Card>
        <Text style={styles.hintText}>
          These control your in-app notification feed. There's no SMS or push delivery yet — everything appears here in the app.
        </Text>
        {isLoading || !prefs ? (
          <ActivityIndicator color={colors.brand600} />
        ) : (
          PREFERENCE_LABELS.map(({ key, label, description }, i) => (
            <View key={key} style={[styles.prefRow, i < PREFERENCE_LABELS.length - 1 && styles.rowBorder]}>
              <View style={styles.prefText}>
                <Text style={styles.prefLabel}>{label}</Text>
                <Text style={styles.prefDescription}>{description}</Text>
              </View>
              <Switch
                value={prefs[key]}
                onValueChange={(value) => updatePrefs.mutate({ [key]: value })}
                trackColor={{ false: colors.line, true: colors.teal600 }}
                thumbColor="#fff"
              />
            </View>
          ))
        )}
      </Card>
    </View>
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
  section: { marginBottom: 18 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink400, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  sectionCard: { padding: 4 },
  cardHeading: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink900, marginBottom: 12 },
  hintText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginBottom: 8 },
  sessionsHeader: { marginBottom: 4 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  sessionDevice: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink900, marginRight: 8 },
  sessionDate: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400 },
  logoutAllWrap: { marginTop: 14 },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  prefText: { flex: 1, marginRight: 12 },
  prefLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink900 },
  prefDescription: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 10 },
  rowIcon: { marginRight: 12 },
  rowLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink900 },
});
