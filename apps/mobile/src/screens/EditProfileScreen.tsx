import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UpdateProfileSchema, type UpdateProfileInput } from '@ghar-doc/shared';
import { useAuthStore } from '../lib/auth-store';
import { useUpdateProfile } from '../hooks/useProfile';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/colors';
import type { PatientStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone ?? undefined },
  });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Controller control={control} name="firstName" render={({ field }) => (
            <Field label="First name" value={field.value ?? ''} onChangeText={field.onChange} error={errors.firstName?.message} />
          )} />
          <Controller control={control} name="lastName" render={({ field }) => (
            <Field label="Last name" value={field.value ?? ''} onChangeText={field.onChange} error={errors.lastName?.message} />
          )} />
          <Controller control={control} name="phone" render={({ field }) => (
            <Field label="Phone" value={field.value ?? ''} onChangeText={field.onChange} keyboardType="phone-pad" error={errors.phone?.message} />
          )} />
          {update.isError ? <Text style={styles.errorText}>Could not save changes. Please try again.</Text> : null}
          {update.isSuccess ? <Text style={styles.successText}>Profile updated.</Text> : null}
          <Button
            title={update.isPending ? 'Saving…' : 'Save changes'}
            onPress={handleSubmit((data) => update.mutate(data, { onSuccess: () => navigation.goBack() }))}
            disabled={update.isPending}
            loading={update.isPending}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  errorText: { fontFamily: fonts.regular, color: colors.danger, fontSize: 13, marginBottom: 12 },
  successText: { fontFamily: fonts.regular, color: colors.sage600, fontSize: 13, marginBottom: 12 },
});
