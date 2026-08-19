import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Role, getLegalTransitions, type VisitDto, type VisitStatus } from '@ghar-doc/shared';
import { useAssignedVisits, useUpdateVisitStatus } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';

const NEXT_ACTION_LABEL: Partial<Record<VisitStatus, string>> = {
  EN_ROUTE: 'Mark en route',
  IN_PROGRESS: 'Mark arrived / start visit',
  COMPLETED: 'Mark completed',
};

export function AssignedVisitsScreen() {
  const { data: visits, isLoading, isRefetching, refetch } = useAssignedVisits();
  const updateStatus = useUpdateVisitStatus();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand600} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.list}
      data={visits ?? []}
      keyExtractor={(v) => v.id}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand600} />}
      ListEmptyComponent={
        <EmptyState icon="calendar" title="No visits assigned yet" message="Visits an admin assigns to you will show up here." />
      }
      renderItem={({ item: visit }) => (
        <VisitCard visit={visit} onAdvance={(status) => updateStatus.mutate({ id: visit.id, status })} advancing={updateStatus.isPending} />
      )}
    />
  );
}

function VisitCard({ visit, onAdvance, advancing }: { visit: VisitDto; onAdvance: (s: VisitStatus) => void; advancing: boolean }) {
  const nextTransitions = getLegalTransitions(visit.status, Role.DOCTOR).filter((t) => t.to !== 'CANCELLED');
  return (
    <Card>
      <View style={styles.rowBetween}>
        <VisitStatusBadge status={visit.status} />
        <Text style={styles.timestamp}>{new Date(visit.requestedAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.reason}>{visit.reasonForVisit}</Text>
      <Text style={styles.address}>
        {visit.addressLine1}, {visit.city}, {visit.state} {visit.postalCode}
      </Text>
      <Text style={styles.patient}>
        Patient: {visit.patient.firstName} {visit.patient.lastName}
        {visit.patient.phone ? ` · ${visit.patient.phone}` : ''}
      </Text>
      {nextTransitions.length > 0 ? (
        <View style={styles.actions}>
          {nextTransitions.map((t) => (
            <View key={t.to} style={styles.actionButton}>
              <Button title={NEXT_ACTION_LABEL[t.to] ?? t.to} onPress={() => onAdvance(t.to)} disabled={advancing} />
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, flexGrow: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontSize: 12, color: colors.textMuted },
  reason: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  address: { fontSize: 13, color: colors.textMuted },
  patient: { fontSize: 13, color: colors.text, marginTop: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionButton: { minWidth: 140 },
});
