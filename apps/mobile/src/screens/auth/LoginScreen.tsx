import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginSchema, type LoginInput } from '@ghar-doc/shared';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { colors, fonts } from '../../theme/colors';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Image source={require('../../../assets/logo-icon.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>
              <Text style={styles.gharText}>Ghar</Text>
              <Text style={styles.docText}>Doc</Text>
            </Text>
            <Text style={styles.subtitle}>Doctor home visits, sorted.</Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Field
                label="Email"
                value={field.value ?? ''}
                onChangeText={field.onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Field
                label="Password"
                value={field.value ?? ''}
                onChangeText={field.onChange}
                secureTextEntry
                autoCapitalize="none"
                error={errors.password?.message}
              />
            )}
          />
          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotWrap}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>

          {login.isError ? <Text style={styles.errorText}>Invalid email or password.</Text> : null}
          <Button
            title={login.isPending ? 'Signing in…' : 'Sign in'}
            onPress={handleSubmit((data) => login.mutate(data))}
            disabled={login.isPending}
            loading={login.isPending}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 64, height: 64, marginBottom: 8 },
  title: { fontFamily: fonts.extraBold, fontSize: 26 },
  gharText: { color: colors.gharBlue },
  docText: { color: colors.brand600 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 16 },
  errorText: { fontFamily: fonts.regular, color: colors.danger, fontSize: 13, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontFamily: fonts.regular, color: colors.textMuted, fontSize: 13 },
  link: { fontFamily: fonts.semiBold, color: colors.brand600, fontSize: 13 },
});
