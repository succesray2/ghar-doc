import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme/colors';
import { Button } from './Button';

interface Props {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  ctaTitle?: string;
  onPressCta?: () => void;
}

// The icon + message + CTA empty-state pattern from the reference screenshots.
export function EmptyState({ icon, title, message, ctaTitle, onPressCta }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={28} color={colors.brand600} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {ctaTitle && onPressCta ? (
        <View style={styles.cta}>
          <Button title={ctaTitle} onPress={onPressCta} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, marginBottom: 6 },
  message: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
  cta: { minWidth: 180 },
});
