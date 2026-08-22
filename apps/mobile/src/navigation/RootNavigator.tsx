import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSessionBootstrap } from '../hooks/useAuth';
import { useAuthStore } from '../lib/auth-store';
import { colors } from '../theme/colors';
import { AuthNavigator } from './AuthNavigator';
import { PatientNavigator } from './PatientNavigator';
import { DoctorNavigator } from './DoctorNavigator';
import { NurseNavigator } from './NurseNavigator';
import { PhysiotherapistNavigator } from './PhysiotherapistNavigator';
import { AdminNavigator } from './AdminNavigator';

// Mirrors apps/web's RootLayout: block all rendering until the session
// bootstrap query settles, then switch on whether a user session exists —
// same logical gate as web's ProtectedRoute, expressed as navigator choice.
export function RootNavigator() {
  const { isLoading } = useSessionBootstrap();
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brand600} />
        <Text style={styles.loadingText}>Loading Ghar Doc…</Text>
      </View>
    );
  }

  if (!user) return <AuthNavigator />;

  switch (user.role) {
    case 'ADMIN':
      return <AdminNavigator />;
    case 'DOCTOR':
      return <DoctorNavigator />;
    case 'NURSE':
      return <NurseNavigator />;
    case 'PHYSIOTHERAPIST':
      return <PhysiotherapistNavigator />;
    default:
      return <PatientNavigator />;
  }
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, gap: 12 },
  loadingText: { color: colors.textMuted, fontSize: 14 },
});
