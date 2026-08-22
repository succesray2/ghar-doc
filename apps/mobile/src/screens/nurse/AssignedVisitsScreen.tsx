import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Role, getLegalTransitions, type VisitDto, type VisitStatus } from '@ghar-doc/shared';
import { useAssignedVisits, useUpdateVisitStatus } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';

const NEXT_ACTION_LABEL: Partial<Record<VisitStatus, string>> = {
  PROVIDER_ACCEPTED: 'Accept',
  PROVIDER_DECLINED: 'Decline',
  EN_ROUTE: 'Mark en route',
  ARRIVED: 'Mark arrived',
  IN_PROGRESS: 'Start visit',
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
  const nextTransitions = getLegalTransitions(visit.status, Role.NURSE).filter((t) => t.to !== 'CANCELLED');
  return (
    <Card>
      <View style={styles.rowBetween}>
        <VisitStatusBadge status={visit.status} />
        <Text style={styles.timestamp}>{new Date(visit.requestedAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.reason}>{visit.reasonForVisit}</Text>
      {visit.serviceDetails && 'nursingServiceType' in visit.serviceDetails ? (
        <Text style={styles.service}>
          Service: {visit.serviceDetails.nursingServiceType}
          {visit.serviceDetails.careNotes ? ` — ${visit.serviceDetails.careNotes}` : ''}
        </Text>
      ) : null}
      <Text style={styles.address}>
        {visit.addressLine1}, {visit.city}, {visit.state} {visit.postalCode}
      </Text>
      <Text style={styles.patient}>
        Patient: {visit.patient.firstName} {visit.patient.lastName}
        {visit.patient.phone ? ` · ${visit.patient.phone}` : ''}
      </Text>
      {visit.bookingFor !== 'SELF' ? (
        <Text style={styles.patient}>
          Booked for: {visit.patientName}
          {visit.patientAge ? `, age ${visit.patientAge}` : ''} by {visit.caregiverName} · {visit.caregiverPhone}
        </Text>
      ) : null}
      {nextTransitions.length > 0 ? (
        <View style={styles.actions}>
          {nextTransitions.map((t) => (
            <View key={t.to} style={styles.actionButton}>
              <Button
                title={NEXT_ACTION_LABEL[t.to] ?? t.to}
                variant={t.to === 'PROVIDER_DECLINED' ? 'danger' : 'primary'}
                disabled={advancing}
                onPress={() => {
                  if (t.to === 'PROVIDER_DECLINED') {
                    Alert.alert('Decline this visit request?', undefined, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Decline', style: 'destructive', onPress: () => onAdvance(t.to) },
                    ]);
                    return;
                  }
                  onAdvance(t.to);
                }}
              />
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
  timestamp: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  reason: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, marginBottom: 4 },
  service: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginBottom: 4 },
  address: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  patient: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginTop: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionButton: { minWidth: 140 },
});
