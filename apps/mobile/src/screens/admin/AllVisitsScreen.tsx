import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { VisitDto, VisitStatus } from '@ghar-doc/shared';
import { useAllVisits } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';
import type { AdminStackParamList, AdminTabParamList } from '../../navigation/types';

const STATUS_FILTERS: { label: string; value: VisitStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'En route', value: 'EN_ROUTE' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

type Props = CompositeScreenProps<
  BottomTabScreenProps<AdminTabParamList, 'AllVisits'>,
  NativeStackScreenProps<AdminStackParamList>
>;

export function AllVisitsScreen({ navigation }: Props) {
  const [status, setStatus] = useState<VisitStatus | undefined>(undefined);
  const { data: visits, isLoading, isRefetching, refetch } = useAllVisits(status);

  return (
    <View style={styles.flex}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
        data={STATUS_FILTERS}
        keyExtractor={(f) => f.label}
        renderItem={({ item: f }) => (
          <Pressable
            onPress={() => setStatus(f.value)}
            style={[styles.pill, status === f.value && styles.pillActive]}
          >
            <Text style={[styles.pillText, status === f.value && styles.pillTextActive]}>{f.label}</Text>
          </Pressable>
        )}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand600} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={visits ?? []}
          keyExtractor={(v) => v.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand600} />}
          ListEmptyComponent={<EmptyState icon="list" title="No visits found" message="Nothing matches this filter yet." />}
          renderItem={({ item: visit }) => (
            <VisitCard
              visit={visit}
              onAssign={() => navigation.navigate('AssignDoctorModal', { visitId: visit.id, reasonForVisit: visit.reasonForVisit })}
            />
          )}
        />
      )}
    </View>
  );
}

function VisitCard({ visit, onAssign }: { visit: VisitDto; onAssign: () => void }) {
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
      <Text style={styles.person}>Patient: {visit.patient.firstName} {visit.patient.lastName}</Text>
      {visit.doctor ? <Text style={styles.person}>Doctor: {visit.doctor.firstName} {visit.doctor.lastName}</Text> : null}
      {visit.status === 'REQUESTED' ? (
        <View style={styles.assignButton}>
          <Button title="Assign doctor" onPress={onAssign} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexGrow: 0, paddingTop: 12 },
  filterRowContent: { paddingHorizontal: 16, gap: 8 },
  pill: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: colors.card, marginRight: 8 },
  pillActive: { backgroundColor: colors.brand600 },
  pillText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: '#fff' },
  list: { padding: 16, flexGrow: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  reason: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, marginBottom: 4 },
  address: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  person: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginTop: 2 },
  assignButton: { marginTop: 12, alignSelf: 'flex-start', minWidth: 140 },
});
