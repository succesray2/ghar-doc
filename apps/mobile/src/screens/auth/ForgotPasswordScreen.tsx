import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { AuthStackParamList } from '../../navigation/types';

// Same contact info as SupportScreen.tsx — kept in sync deliberately.
const SUPPORT_EMAIL = 'care@ghardoc.com';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// Self-serve password reset (OTP/token by email or SMS) isn't built yet —
// there's no email or SMS provider integrated anywhere in this system. This
// screen says that plainly and routes to support instead of a fake "check
// your email" flow that would never actually deliver anything.
export function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="lock-reset" size={26} color={colors.navy700} />
          </View>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.body}>
            Self-serve password reset isn't available in the app yet. To reset your password, contact our support
            team with the email address on your account, and we'll help you regain access.
          </Text>
        </View>
        <Button
          title="Email support"
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Password reset request`)}
        />
        <View style={styles.backWrap}>
          <Button title="Back to sign in" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 24 },
  header: { alignItems: 'center' },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.text, marginBottom: 8, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  backWrap: { marginTop: 12, width: '100%' },
});
