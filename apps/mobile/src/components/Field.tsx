import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  hint?: string;
}

// Combined equivalent of apps/web's Field.tsx (label+error wrapper) + Input.tsx.
// Any field passed secureTextEntry gets a show/hide eye toggle automatically —
// one implementation shared by every password field in the app (Login,
// Signup, and any future reset/change-password screen), not duplicated logic.
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
  hint,
}: Props) {
  const [visible, setVisible] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            isPassword && styles.inputWithIcon,
            multiline && styles.multiline,
            !!error && styles.inputError,
          ]}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.eyeButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <Feather name={visible ? 'eye-off' : 'eye'} size={19} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.text, marginBottom: 6 },
  inputRow: { position: 'relative', justifyContent: 'center' },
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
  inputWithIcon: { paddingRight: 44 },
  eyeButton: { position: 'absolute', right: 12, padding: 4 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  hint: { fontFamily: fonts.regular, color: colors.textMuted, fontSize: 12, marginTop: 4 },
  error: { fontFamily: fonts.regular, color: colors.danger, fontSize: 12, marginTop: 4 },
});
