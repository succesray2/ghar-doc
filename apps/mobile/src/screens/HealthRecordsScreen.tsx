import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { colors, fonts } from '../theme/colors';

// MOCK — no document storage/health-records API exists yet. Shown populated
// so the section reads as intended in the UI; nothing here is a real record.
const CATEGORIES: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; items: { name: string; date: string }[] }[] = [
  {
    icon: 'prescription',
    title: 'Prescriptions',
    items: [{ name: 'Dr. Anjali Rao — Fever & body ache', date: '18 Aug 2026' }],
  },
  {
    icon: 'file-document-outline',
    title: 'Diagnostic Reports',
    items: [{ name: 'Complete Blood Count (CBC)', date: '10 Aug 2026' }],
  },
  { icon: 'note-text-outline', title: 'Doctor Notes', items: [] },
  { icon: 'folder-outline', title: 'Medical Documents', items: [] },
  { icon: 'needle', title: 'Vaccination Records', items: [] },
];

export function HealthRecordsScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      {CATEGORIES.map((cat) => (
        <Card key={cat.title}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={cat.icon} size={20} color={colors.teal600} />
            </View>
            <Text style={styles.title}>{cat.title}</Text>
          </View>
          {cat.items.length === 0 ? (
            <Text style={styles.empty}>Nothing here yet.</Text>
          ) : (
            cat.items.map((item) => (
              <View key={item.name} style={styles.item}>
                <View style={styles.itemText}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
                <MaterialCommunityIcons name="download-outline" size={20} color={colors.ink400} />
              </View>
            ))
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink900 },
  empty: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink400, paddingVertical: 4 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.line, marginTop: 4 },
  itemText: { flex: 1 },
  itemName: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink900 },
  itemDate: { fontFamily: fonts.regular, fontSize: 12, color: colors.ink400, marginTop: 2 },
});
