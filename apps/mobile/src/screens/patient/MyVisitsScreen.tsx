import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Role, VisitStatus, isTransitionAllowed, type VisitDto } from '@ghar-doc/shared';
import { useCancelVisit, useMyVisits } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VisitStatusBadge } from '../../components/VisitStatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';
import type { PatientTabScreenProps } from '../../navigation/types';

type Props = PatientTabScreenProps<'MyVisits'>;

type FilterTab = 'upcoming' | 'completed' | 'followup' | 'cancelled';

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'followup', label: 'Follow-up' },
  { key: 'cancelled', label: 'Cancelled' },
];

const UPCOMING_STATUSES: VisitStatus[] = ['REQUESTED', 'ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS'];

export function MyVisitsScreen({ navigation }: Props) {
  const { data: visits, isLoading, isRefetching, refetch } = useMyVisits();
  const cancelVisit = useCancelVisit();
  const [tab, setTab] = useState<FilterTab>('upcoming');
  const rootNav = navigation.getParent();

  const filtered = useMemo(() => {
    if (!visits) return [];
    if (tab === 'upcoming') return visits.filter((v) => UPCOMING_STATUSES.includes(v.status));
    if (tab === 'completed') return visits.filter((v) => v.status === 'COMPLETED');
    if (tab === 'cancelled') return visits.filter((v) => v.status === 'CANCELLED');
    // "Follow-up" has no backend concept yet — nothing to show here honestly.
    return [];
  }, [visits, tab]);

  return (
    <View style={styles.flex}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabRow}
        contentContainerStyle={styles.tabRowContent}
        data={TABS}
        keyExtractor={(t) => t.key}
        renderItem={({ item: t }) => (
          <Pressable onPress={() => setTab(t.key)} style={[styles.tabPill, tab === t.key && styles.tabPillActive]}>
            <Text style={[styles.tabPillText, tab === t.key && styles.tabPillTextActive]}>{t.label}</Text>
          </Pressable>
        )}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.teal600} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filtered}
          keyExtractor={(v) => v.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.teal600} />}
          ListEmptyComponent={
            tab === 'followup' ? (
              <EmptyState icon="clock" title="No follow-ups" message="Follow-up scheduling isn't available yet." />
            ) : (
              <EmptyState
                icon="clipboard"
                title="No visits here"
                message="Request a doctor home visit to see it here."
                ctaTitle="Request a visit"
                onPressCta={() => rootNav?.navigate('RequestVisit', undefined)}
              />
            )
          }
          renderItem={({ item: visit }) => (
            <VisitCard visit={visit} onCancel={() => cancelVisit.mutate({ id: visit.id })} cancelling={cancelVisit.isPending} />
          )}
        />
      )}
    </View>
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
  tabRow: { flexGrow: 0, paddingTop: 12 },
  tabRowContent: { paddingHorizontal: 16, gap: 8 },
  tabPill: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.card, marginRight: 8, borderWidth: 1, borderColor: colors.line },
  tabPillActive: { backgroundColor: colors.teal600, borderColor: colors.teal600 },
  tabPillText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink600 },
  tabPillTextActive: { color: '#fff' },
  list: { padding: 16, flexGrow: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  reason: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, marginBottom: 4 },
  address: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  doctor: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginTop: 4 },
  cancelWrap: { marginTop: 12, alignSelf: 'flex-start', minWidth: 100 },
});
