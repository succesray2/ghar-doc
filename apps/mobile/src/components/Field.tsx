import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { colors, fonts } from '../theme/colors';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  placeholder?: string;
}

// Combined equivalent of apps/web's Field.tsx (label+error wrapper) + Input.tsx.
export function Field({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  multiline,
  placeholder,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.multiline, !!error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  error: { fontFamily: fonts.regular, color: colors.danger, fontSize: 12, marginTop: 4 },
});
