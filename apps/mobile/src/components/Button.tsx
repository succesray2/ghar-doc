import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.brand600 : '#fff'} />
      ) : (
        <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { fontFamily: fonts.semiBold, fontSize: 16 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.teal600 },
  secondary: { backgroundColor: colors.teal100 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.danger },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: '#fff' },
  secondary: { color: colors.brand700 },
  ghost: { color: colors.text },
  danger: { color: '#fff' },
});
