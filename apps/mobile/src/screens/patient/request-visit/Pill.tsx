import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../../../theme/colors';

export function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  text: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  textActive: { color: colors.brand700 },
});
