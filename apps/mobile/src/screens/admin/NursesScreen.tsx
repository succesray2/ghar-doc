import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NurseListItemDto, NurseStatus } from '@ghar-doc/shared';
import { useNurses, useUpdateNurseStatus } from '../../hooks/useNurses';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { colors, fonts } from '../../theme/colors';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'Nurses'>;

const STATUS_FILTERS: { label: string; value: NurseStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

const STATUS_BADGE: Record<NurseStatus, { bg: string; text: string }> = {
  ACTIVE: { bg: colors.sage100, text: colors.sage600 },
  SUSPENDED: { bg: colors.line, text: colors.ink400 },
};

export function NursesScreen({ navigation }: Props) {
  const [status, setStatus] = useState<NurseStatus | undefined>(undefined);
  const { data: nurses, isLoading } = useNurses(status);
  const updateStatus = useUpdateNurseStatus();

  return (
    <View style={styles.flex}>
      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((f) => (
          <Pressable key={f.label} onPress={() => setStatus(f.value)} style={[styles.pill, status === f.value && styles.pillActive]}>
            <Text style={[styles.pillText, status === f.value && styles.pillTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
        <View style={styles.addButtonWrap}>
          <Button title="+ Add" onPress={() => navigation.navigate('CreateNurseModal')} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand600} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={nurses ?? []}
          keyExtractor={(n) => n.id}
          ListEmptyComponent={<EmptyState icon="users" title="No nurses found" message="Nothing matches this filter yet." />}
          renderItem={({ item: nurse }) => (
            <NurseCard
              nurse={nurse}
              busy={updateStatus.isPending}
              onSuspend={() =>
                Alert.alert('Suspend this nurse?', undefined, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Suspend', style: 'destructive', onPress: () => updateStatus.mutate({ id: nurse.id, status: 'SUSPENDED' }) },
                ])
              }
              onReactivate={() => updateStatus.mutate({ id: nurse.id, status: 'ACTIVE' })}
            />
          )}
        />
      )}
    </View>
  );
}

function NurseCard({
  nurse,
  busy,
  onSuspend,
  onReactivate,
}: {
  nurse: NurseListItemDto;
  busy: boolean;
  onSuspend: () => void;
  onReactivate: () => void;
}) {
  const badge = STATUS_BADGE[nurse.status];
  return (
    <Card>
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{nurse.status}</Text>
      </View>
      <Text style={styles.name}>{nurse.firstName} {nurse.lastName} · {nurse.qualification}</Text>
      <Text style={styles.meta}>{nurse.email}</Text>
      <Text style={styles.meta}>
        License {nurse.licenseNumber}
        {nurse.yearsExperience != null ? ` · ${nurse.yearsExperience} yrs experience` : ''}
      </Text>
      {nurse.statusReason ? <Text style={styles.reason}>"{nurse.statusReason}"</Text> : null}
      <View style={styles.actionWrap}>
        {nurse.status === 'SUSPENDED' ? (
          <Button title="Reactivate" onPress={onReactivate} disabled={busy} />
        ) : (
          <Button title="Suspend" variant="danger" onPress={onSuspend} disabled={busy} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: 16, paddingBottom: 8 },
  addButtonWrap: { marginLeft: 'auto' },
  pill: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: colors.card },
  pillActive: { backgroundColor: colors.brand600 },
  pillText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 8, flexGrow: 1 },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 11 },
  name: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.text },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  reason: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginTop: 6 },
  actionWrap: { marginTop: 12, alignSelf: 'flex-start', minWidth: 130 },
});
