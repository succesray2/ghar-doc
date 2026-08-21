import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NotificationCategory } from '@ghar-doc/shared';
import { useMarkNotificationRead, useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { colors, fonts } from '../theme/colors';

const CATEGORY_ICON: Record<NotificationCategory, keyof typeof MaterialCommunityIcons.glyphMap> = {
  BOOKING_UPDATE: 'calendar-check-outline',
  PROVIDER_ASSIGNMENT: 'account-check-outline',
  PROVIDER_ARRIVAL: 'map-marker-check-outline',
  SERVICE_UPDATE: 'briefcase-outline',
  PAYMENT_UPDATE: 'credit-card-outline',
  GENERAL: 'bell-outline',
};

export function NotificationsScreen() {
  const { data: notifications, isLoading, isRefetching, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();

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
      data={notifications ?? []}
      keyExtractor={(n) => n.id}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand600} />}
      ListEmptyComponent={<EmptyState icon="bell" title="No notifications" message="You're all caught up." />}
      renderItem={({ item }) => (
        <Pressable onPress={() => !item.readAt && markRead.mutate(item.id)}>
          <Card style={[styles.row, !item.readAt && styles.rowUnread]}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={CATEGORY_ICON[item.category]} size={20} color={colors.navy700} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, flexGrow: 1 },
  row: { flexDirection: 'row', gap: 12 },
  rowUnread: { borderColor: colors.brand600, borderWidth: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.teal100, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink900 },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink600, marginTop: 2 },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.ink400, marginTop: 4 },
});
