import { StyleSheet, Text, View } from 'react-native';
import type { TriagePriority } from '@ghar-doc/shared';
import { colors, fonts } from '../theme/colors';

const STYLES: Record<TriagePriority, { bg: string; text: string; label: string; icon: string }> = {
  RED: { bg: colors.dangerBg, text: colors.danger, label: 'Urgent', icon: '▲' },
  ORANGE: { bg: '#fef3c7', text: '#92400e', label: 'Priority', icon: '●' },
  GREEN: { bg: colors.teal100, text: colors.brand700, label: 'Routine', icon: '✓' },
};

// Icon + text + colour together, never colour alone — a colour-blind user
// can't rely on red/green tint by itself to tell urgency apart.
export function TriagePriorityBadge({ priority }: { priority: TriagePriority }) {
  const { bg, text, label, icon } = STYLES[priority];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>
        {icon} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontFamily: fonts.bold, fontSize: 12 },
});
