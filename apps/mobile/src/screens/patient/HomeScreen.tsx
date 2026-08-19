import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../../lib/auth-store';
import { useMyVisits } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { colors } from '../../theme/colors';
import type { PatientTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<PatientTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: visits } = useMyVisits();
  const latest = visits?.[0];

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.greeting}>Hi {user?.firstName ?? 'there'},</Text>
      <Text style={styles.subGreeting}>Doctor home visits, sorted.</Text>

      <Card style={styles.ctaCard}>
        <View style={styles.ctaIcon}>
          <Feather name="home" size={22} color="#fff" />
        </View>
        <Text style={styles.ctaTitle}>Doctors to your doorstep</Text>
        <Text style={styles.ctaSubtitle}>Request a home visit and an admin will assign a doctor to you.</Text>
        <View style={styles.ctaButton}>
          <Button title="Request a visit" onPress={() => navigation.navigate('RequestVisit')} />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Latest visit</Text>
      {latest ? (
        <Card>
          <View style={styles.rowBetween}>
            <VisitStatusBadge status={latest.status} />
            <Text style={styles.timestamp}>{new Date(latest.requestedAt).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.reason}>{latest.reasonForVisit}</Text>
          {latest.doctor ? (
            <Text style={styles.doctor}>Doctor: {latest.doctor.firstName} {latest.doctor.lastName}</Text>
          ) : null}
          <View style={styles.linkButton}>
            <Button title="View all visits" variant="ghost" onPress={() => navigation.navigate('MyVisits')} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.emptyText}>No visits yet — request one above to get started.</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text },
  subGreeting: { fontSize: 14, color: colors.textMuted, marginTop: 2, marginBottom: 20 },
  ctaCard: { backgroundColor: colors.brand600, borderRadius: 20 },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  ctaButton: { alignSelf: 'flex-start', minWidth: 160, backgroundColor: 'transparent' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontSize: 12, color: colors.textMuted },
  reason: { fontSize: 16, fontWeight: '600', color: colors.text },
  doctor: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  linkButton: { marginTop: 12, alignSelf: 'flex-start' },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
