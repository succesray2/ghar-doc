import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { EmptyState } from '../components/EmptyState';
import { colors, fonts } from '../theme/colors';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: string;
}

// Session-local only — no family-member API exists yet, so additions here
// don't persist past an app restart. Kept interactive rather than fully
// static since it's cheap and demonstrates the intended flow properly.
const SEED: FamilyMember[] = [{ id: 'seed-1', name: 'Ramesh (Father)', relationship: 'Father', age: '62' }];

export function FamilyMembersScreen() {
  const [members, setMembers] = useState<FamilyMember[]>(SEED);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [age, setAge] = useState('');

  const addMember = () => {
    if (!name.trim()) return;
    setMembers((prev) => [...prev, { id: `m-${Date.now()}`, name, relationship: relationship || 'Family', age }]);
    setName('');
    setRelationship('');
    setAge('');
    setAdding(false);
  };

  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.list}
      data={members}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        adding ? (
          <Card>
            <Field label="Name" value={name} onChangeText={setName} placeholder="Full name" />
            <Field label="Relationship" value={relationship} onChangeText={setRelationship} placeholder="e.g. Mother, Son" />
            <Field label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
            <View style={styles.addActions}>
              <View style={styles.addButton}>
                <Button title="Cancel" variant="secondary" onPress={() => setAdding(false)} />
              </View>
              <View style={styles.addButton}>
                <Button title="Add" onPress={addMember} disabled={!name.trim()} />
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
        <EmptyState icon="users" title="No family members yet" message="Add your family to manage their healthcare from here." />
      }
      renderItem={({ item }) => (
        <Card style={styles.row}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-outline" size={20} color={colors.navy700} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.relationship}{item.age ? ` · Age ${item.age}` : ''}</Text>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, flexGrow: 1 },
  addRow: { marginBottom: 12 },
  addActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  addButton: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  name: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
});
