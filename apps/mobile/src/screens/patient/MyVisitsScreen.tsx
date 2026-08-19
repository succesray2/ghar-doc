import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Role, VisitStatus, isTransitionAllowed, type VisitDto } from '@ghar-doc/shared';
import { useCancelVisit, useMyVisits } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<PatientTabParamList, 'MyVisits'>;

export function MyVisitsScreen({ navigation }: Props) {
  const { data: visits, isLoading, isRefetching, refetch } = useMyVisits();
  const cancelVisit = useCancelVisit();

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
        <EmptyState
          icon="clipboard"
          title="No visits yet"
          message="Request a doctor home visit to see it here."
          ctaTitle="Request a visit"
          onPressCta={() => navigation.navigate('RequestVisit')}
        />
      }
      renderItem={({ item: visit }) => (
        <VisitCard visit={visit} onCancel={() => cancelVisit.mutate({ id: visit.id })} cancelling={cancelVisit.isPending} />
      )}
    />
  );
}

function VisitCard({ visit, onCancel, cancelling }: { visit: VisitDto; onCancel: () => void; cancelling: boolean }) {
  const canCancel = isTransitionAllowed(visit.status, VisitStatus.CANCELLED, Role.PATIENT);
  return (
    <Card>
      <View style={styles.rowBetween}>
        <VisitStatusBadge status={visit.status} />
        <Text style={styles.timestamp}>{new Date(visit.requestedAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.reason}>{visit.reasonForVisit}</Text>
      <Text style={styles.address}>{visit.addressLine1}, {visit.city}</Text>
      {visit.doctor ? (
        <Text style={styles.doctor}>Doctor: {visit.doctor.firstName} {visit.doctor.lastName}</Text>
      ) : null}
      {canCancel ? (
        <View style={styles.cancelWrap}>
          <Button title="Cancel" variant="danger" onPress={onCancel} disabled={cancelling} loading={cancelling} />
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
  address: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  doctor: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginTop: 4 },
  cancelWrap: { marginTop: 12, alignSelf: 'flex-start', minWidth: 100 },
});
