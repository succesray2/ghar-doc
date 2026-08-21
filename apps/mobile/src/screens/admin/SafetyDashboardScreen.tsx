import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafetyStats } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { colors, fonts } from '../../theme/colors';

export function SafetyDashboardScreen() {
  const { data: stats, isLoading } = useSafetyStats();

  if (isLoading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.teal600} />
      </View>
    );
  }

  const total = stats.byPriority.RED + stats.byPriority.ORANGE + stats.byPriority.GREEN;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Text style={styles.hint}>Dispatch-priority breakdown across all visits ever requested.</Text>
      <View style={styles.grid}>
        <StatCard label="Total requests" value={total} />
        <StatCard label="Urgent (RED)" value={stats.byPriority.RED} tone={colors.danger} />
        <StatCard label="Priority (ORANGE)" value={stats.byPriority.ORANGE} tone="#92400e" />
        <StatCard label="Routine (GREEN)" value={stats.byPriority.GREEN} tone={colors.brand700} />
      </View>

      <Text style={styles.sectionTitle}>Currently unassigned, by priority</Text>
      <View style={styles.grid}>
        <StatCard label="Urgent, unassigned" value={stats.unassignedByPriority.RED} tone={colors.danger} />
        <StatCard label="Priority, unassigned" value={stats.unassignedByPriority.ORANGE} tone="#92400e" />
        <StatCard label="Routine, unassigned" value={stats.unassignedByPriority.GREEN} tone={colors.brand700} />
        <StatCard label="Cancelled (all time)" value={stats.cancelled} />
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, tone ? { color: tone } : null]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16 },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginTop: 8, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%' },
  statLabel: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  statValue: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.text, marginTop: 4 },
});
