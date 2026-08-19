import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { colors, fonts } from '../theme/colors';

// MOCK — no notifications system/push infra exists yet.
const NOTIFICATIONS: { id: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; body: string; time: string }[] = [
  { id: 'n1', icon: 'calendar-check-outline', title: 'Appointment confirmed', body: 'Dr. Anjali Rao has been assigned to your visit.', time: '2h ago' },
  { id: 'n2', icon: 'file-check-outline', title: 'Report available', body: 'Your CBC report is ready to view.', time: '1d ago' },
  { id: 'n3', icon: 'clock-outline', title: 'Follow-up reminder', body: 'A follow-up was recommended in 7 days.', time: '3d ago' },
];

export function NotificationsScreen() {
  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.list}
      data={NOTIFICATIONS}
      keyExtractor={(n) => n.id}
      ListEmptyComponent={<EmptyState icon="bell" title="No notifications" message="You're all caught up." />}
      renderItem={({ item }) => (
        <Card style={styles.row}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name={item.icon} size={20} color={colors.navy700} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, flexGrow: 1 },
  row: { flexDirection: 'row', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, marginTop: 2 },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400, marginTop: 4 },
});
