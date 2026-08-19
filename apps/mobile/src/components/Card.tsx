import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors } from '../theme/colors';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    // Matches apps/marketing/tailwind.config.ts's `soft` shadow token.
    shadowColor: colors.navy900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
