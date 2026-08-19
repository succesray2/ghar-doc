import { StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../lib/auth-store';
import { useLogout } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';

const ROLE_LABEL: Record<string, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  ADMIN: 'Admin',
};

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!user) return null;

  const initial = user.firstName?.charAt(0).toUpperCase() ?? '?';

  return (
    <View style={styles.flex}>
      <Card style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.role}>{ROLE_LABEL[user.role] ?? user.role}</Text>
        </View>
      </Card>

      <Card>
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={user.phone ?? '—'} last />
      </Card>

      <View style={styles.logoutWrap}>
        <Button
          title={logout.isPending ? 'Logging out…' : 'Log out'}
          variant="danger"
          onPress={() => logout.mutate()}
          disabled={logout.isPending}
          loading={logout.isPending}
        />
      </View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  headerCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.navy700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, color: '#fff', fontSize: 22 },
  headerInfo: { flexShrink: 1 },
  name: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  role: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  row: { paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  rowValue: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  logoutWrap: { marginTop: 24 },
});
