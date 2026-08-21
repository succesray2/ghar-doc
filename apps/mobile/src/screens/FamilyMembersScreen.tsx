import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FamilyRelation, type FamilyMemberDto } from '@ghar-doc/shared';
import { useCreateFamilyMember, useDeleteFamilyMember, useFamilyMembers } from '../hooks/useFamilyMembers';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { EmptyState } from '../components/EmptyState';
import { colors, fonts } from '../theme/colors';

const RELATION_LABEL: Record<FamilyRelation, string> = {
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER: 'Other',
};

export function FamilyMembersScreen() {
  const { data: members, isLoading } = useFamilyMembers();
  const createMember = useCreateFamilyMember();
  const deleteMember = useDeleteFamilyMember();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<FamilyRelation>('OTHER');
  const [age, setAge] = useState('');

  const addMember = () => {
    if (!name.trim()) return;
    createMember.mutate(
      { name, relation, age: age ? Number(age) : undefined },
      {
        onSuccess: () => {
          setName('');
          setRelation('OTHER');
          setAge('');
          setAdding(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand600} />
      </View>
    );
  }

  return (
    <FlatList<FamilyMemberDto>
      style={styles.flex}
      contentContainerStyle={styles.list}
      data={members ?? []}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        adding ? (
          <Card>
            <Field label="Name" value={name} onChangeText={setName} placeholder="Full name" />
            <Text style={styles.relationLabel}>Relation</Text>
            <View style={styles.relationRow}>
              {Object.values(FamilyRelation).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRelation(r)}
                  style={[styles.pill, relation === r && styles.pillActive]}
                >
                  <Text style={[styles.pillText, relation === r && styles.pillTextActive]}>{RELATION_LABEL[r]}</Text>
                </Pressable>
              ))}
            </View>
            <Field label="Age (optional)" value={age} onChangeText={setAge} keyboardType="number-pad" />
            <View style={styles.addActions}>
              <View style={styles.addButton}>
                <Button title="Cancel" variant="secondary" onPress={() => setAdding(false)} />
              </View>
              <View style={styles.addButton}>
                <Button
                  title={createMember.isPending ? 'Adding…' : 'Add'}
                  onPress={addMember}
                  disabled={!name.trim() || createMember.isPending}
                />
              </View>
            </View>
          </Card>
        ) : (
          <View style={styles.addRow}>
            <Button title="+ Add family member" variant="secondary" onPress={() => setAdding(true)} />
          </View>
        )
      }
      ListEmptyComponent={
        <EmptyState icon="users" title="No family members yet" message="Add your family to book visits for them from here." />
      }
      renderItem={({ item }) => (
        <Card style={styles.row}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-outline" size={20} color={colors.navy700} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {RELATION_LABEL[item.relation]}
              {item.age ? ` · Age ${item.age}` : ''}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert('Remove family member?', undefined, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => deleteMember.mutate(item.id) },
              ])
            }
            hitSlop={8}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
          </Pressable>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, flexGrow: 1 },
  addRow: { marginBottom: 12 },
  addActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  addButton: { flex: 1 },
  relationLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text, marginBottom: 6 },
  relationRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 38,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: 6,
    marginBottom: 6,
  },
  pillActive: { borderColor: colors.teal600, backgroundColor: colors.teal100 },
  pillText: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: colors.brand700 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  name: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
});
