import { StyleSheet, Text, View } from 'react-native';
import type { TriagePriority } from '@ghar-doc/shared';
import { colors, fonts } from '../theme/colors';

const STYLES: Record<TriagePriority, { bg: string; text: string; label: string }> = {
  RED: { bg: colors.dangerBg, text: colors.danger, label: 'Urgent' },
  ORANGE: { bg: '#fef3c7', text: '#92400e', label: 'Priority' },
  GREEN: { bg: colors.teal100, text: colors.brand700, label: 'Routine' },
};

export function TriagePriorityBadge({ priority }: { priority: TriagePriority }) {
  const { bg, text, label } = STYLES[priority];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontFamily: fonts.bold, fontSize: 12 },
});
