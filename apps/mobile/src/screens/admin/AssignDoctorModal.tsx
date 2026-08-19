import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useAssignableDoctors, useAssignDoctor } from '../../hooks/useAssignDoctor';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AssignDoctorModal'>;

export function AssignDoctorModal({ route, navigation }: Props) {
  const { visitId, reasonForVisit } = route.params;
  const { data: doctors, isLoading } = useAssignableDoctors();
  const assignDoctor = useAssignDoctor();
  const [doctorId, setDoctorId] = useState('');

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Assign a doctor</Text>
        <Text style={styles.subtitle}>{reasonForVisit}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brand600} style={styles.loader} />
      ) : !doctors || doctors.length === 0 ? (
        <Text style={styles.empty}>No approved and available doctors right now.</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={doctors}
          keyExtractor={(d) => d.id}
          renderItem={({ item: d }) => (
            <Pressable style={[styles.row, doctorId === d.id && styles.rowSelected]} onPress={() => setDoctorId(d.id)}>
              <Text style={styles.rowText}>{d.firstName} {d.lastName} · {d.specialty}</Text>
              {doctorId === d.id ? <Feather name="check" size={18} color={colors.brand600} /> : null}
            </Pressable>
          )}
        />
      )}

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.actionButton}>
          <Button
            title={assignDoctor.isPending ? 'Assigning…' : 'Assign'}
            disabled={!doctorId || assignDoctor.isPending}
            loading={assignDoctor.isPending}
            onPress={() => assignDoctor.mutate({ visitId, doctorId }, { onSuccess: () => navigation.goBack() })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  loader: { marginTop: 24 },
  empty: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
  list: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowSelected: { borderColor: colors.brand500, backgroundColor: colors.brand50 },
  rowText: { fontSize: 14, color: colors.text, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionButton: { flex: 1 },
});
