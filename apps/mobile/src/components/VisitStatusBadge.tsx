import { StyleSheet, Text, View } from 'react-native';
import type { VisitStatus } from '@ghar-doc/shared';
import { statusColors } from '../theme/colors';

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  const { bg, text, label } = statusColors[status] ?? statusColors.REQUESTED;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: { fontSize: 12, fontWeight: '700' },
});
