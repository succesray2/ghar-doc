import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SignupPatientSchema,
  SignupDoctorSchema,
  type SignupPatientInput,
  type SignupDoctorInput,
} from '@ghar-doc/shared';
import { useSignupPatient, useSignupDoctor } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { colors, fonts } from '../../theme/colors';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;
type Tab = 'patient' | 'doctor';

export function SignupScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>('patient');

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
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.tabRow}>
            <Pressable style={[styles.tabButton, tab === 'patient' && styles.tabButtonActive]} onPress={() => setTab('patient')}>
              <Text style={[styles.tabLabel, tab === 'patient' && styles.tabLabelActive]}>I'm a patient</Text>
            </Pressable>
            <Pressable style={[styles.tabButton, tab === 'doctor' && styles.tabButtonActive]} onPress={() => setTab('doctor')}>
              <Text style={[styles.tabLabel, tab === 'doctor' && styles.tabLabelActive]}>I'm a doctor</Text>
            </Pressable>
          </View>

          {tab === 'patient' ? <PatientSignupForm /> : <DoctorSignupForm />}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Sign in</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PatientSignupForm() {
  const signup = useSignupPatient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPatientInput>({ resolver: zodResolver(SignupPatientSchema) });

  return (
    <View>
      <TextField control={control} name="firstName" label="First name" error={errors.firstName?.message} />
      <TextField control={control} name="lastName" label="Last name" error={errors.lastName?.message} />
      <TextField control={control} name="email" label="Email" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
      <TextField control={control} name="password" label="Password" secureTextEntry autoCapitalize="none" error={errors.password?.message} />
      <TextField control={control} name="phone" label="Phone (optional)" keyboardType="phone-pad" />
      <TextField control={control} name="addressLine1" label="Address line 1" error={errors.addressLine1?.message} />
      <TextField control={control} name="addressLine2" label="Address line 2 (optional)" />
      <TextField control={control} name="city" label="City" error={errors.city?.message} />
      <TextField control={control} name="state" label="State" error={errors.state?.message} />
      <TextField control={control} name="postalCode" label="Postal code" keyboardType="number-pad" error={errors.postalCode?.message} />
      {signup.isError ? <Text style={styles.errorText}>Could not create account. Try a different email.</Text> : null}
      <Button
        title={signup.isPending ? 'Creating account…' : 'Create patient account'}
        onPress={handleSubmit((data) => signup.mutate(data))}
        disabled={signup.isPending}
        loading={signup.isPending}
      />
    </View>
  );
}

function DoctorSignupForm() {
  const signup = useSignupDoctor();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDoctorInput>({ resolver: zodResolver(SignupDoctorSchema) });

  return (
    <View>
      <TextField control={control} name="firstName" label="First name" error={errors.firstName?.message} />
      <TextField control={control} name="lastName" label="Last name" error={errors.lastName?.message} />
      <TextField control={control} name="email" label="Email" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
      <TextField control={control} name="password" label="Password" secureTextEntry autoCapitalize="none" error={errors.password?.message} />
      <TextField control={control} name="phone" label="Phone (optional)" keyboardType="phone-pad" />
      <TextField control={control} name="licenseNumber" label="Medical license number" error={errors.licenseNumber?.message} />
      <TextField control={control} name="specialty" label="Specialty" error={errors.specialty?.message} />
      <TextField control={control} name="yearsExperience" label="Years of experience (optional)" keyboardType="number-pad" />
      <Text style={styles.note}>Your account will need admin approval before you can be assigned visits.</Text>
      {signup.isError ? <Text style={styles.errorText}>Could not create account. Try a different email.</Text> : null}
      <Button
        title={signup.isPending ? 'Creating account…' : 'Create doctor account'}
        onPress={handleSubmit((data) => signup.mutate(data))}
        disabled={signup.isPending}
        loading={signup.isPending}
      />
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextField({ control, name, label, error, ...rest }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} value={field.value != null ? String(field.value) : ''} onChangeText={field.onChange} error={error} {...rest} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 40 },
  card: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 64, height: 64, marginBottom: 8 },
  title: { fontFamily: fonts.extraBold, fontSize: 26 },
  gharText: { color: colors.gharBlue },
  docText: { color: colors.brand600 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4 },
  tabRow: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: 10, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  tabButtonActive: { backgroundColor: colors.card },
  tabLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textMuted },
  tabLabelActive: { color: colors.brand700 },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  errorText: { fontFamily: fonts.regular, color: colors.danger, fontSize: 13, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontFamily: fonts.regular, color: colors.textMuted, fontSize: 13 },
  link: { fontFamily: fonts.semiBold, color: colors.brand600, fontSize: 13 },
});
