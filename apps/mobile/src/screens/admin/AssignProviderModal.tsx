import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import type { DoctorListItemDto, NurseListItemDto, PhysiotherapistListItemDto } from '@ghar-doc/shared';
import { useAssignableDoctors, useAssignableNurses, useAssignablePhysiotherapists, useAssignProvider } from '../../hooks/useAssignProvider';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AssignProviderModal'>;

const COPY: Record<Props['route']['params']['serviceType'], { title: string; empty: string }> = {
  DOCTOR_VISIT: { title: 'Assign a doctor', empty: 'No approved and available doctors right now.' },
  NURSING: { title: 'Assign a nurse', empty: 'No active nurses right now.' },
  PHYSIOTHERAPY: { title: 'Assign a physiotherapist', empty: 'No active physiotherapists right now.' },
};

export function AssignProviderModal({ route, navigation }: Props) {
  const { visitId, reasonForVisit, serviceType } = route.params;
  const doctors = useAssignableDoctors();
  const nurses = useAssignableNurses();
  const physiotherapists = useAssignablePhysiotherapists();
  const assignProvider = useAssignProvider();
  const [providerId, setProviderId] = useState('');

  const { data: options, isLoading } = serviceType === 'NURSING' ? nurses : serviceType === 'PHYSIOTHERAPY' ? physiotherapists : doctors;
  const copy = COPY[serviceType];

  const optionLabel = (option: DoctorListItemDto | NurseListItemDto | PhysiotherapistListItemDto) => {
    const detail = 'specialty' in option ? option.specialty : option.qualification;
    return `${option.firstName} ${option.lastName} · ${detail}`;
  };

  const submit = () => {
    const payload =
      serviceType === 'NURSING'
        ? { visitId, nurseId: providerId }
        : serviceType === 'PHYSIOTHERAPY'
          ? { visitId, physiotherapistId: providerId }
          : { visitId, doctorId: providerId };
    assignProvider.mutate(payload, { onSuccess: () => navigation.goBack() });
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{reasonForVisit}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brand600} style={styles.loader} />
      ) : !options || options.length === 0 ? (
        <Text style={styles.empty}>{copy.empty}</Text>
      ) : (
        <FlatList<DoctorListItemDto | NurseListItemDto | PhysiotherapistListItemDto>
          style={styles.list}
          data={options}
          keyExtractor={(o) => o.id}
          renderItem={({ item: o }) => (
            <Pressable style={[styles.row, providerId === o.id && styles.rowSelected]} onPress={() => setProviderId(o.id)}>
              <Text style={styles.rowText}>{optionLabel(o)}</Text>
              {providerId === o.id ? <Feather name="check" size={18} color={colors.brand600} /> : null}
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
            title={assignProvider.isPending ? 'Assigning…' : 'Assign'}
            disabled={!providerId || assignProvider.isPending}
            loading={assignProvider.isPending}
            onPress={submit}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  header: { marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 4 },
  loader: { marginTop: 24 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 8 },
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
  rowText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionButton: { flex: 1 },
});
