import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminCreatePhysiotherapistSchema, type AdminCreatePhysiotherapistInput } from '@ghar-doc/shared';
import { useCreatePhysiotherapist } from '../../hooks/usePhysiotherapists';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'CreatePhysiotherapistModal'>;

export function CreatePhysiotherapistModal({ navigation }: Props) {
  const createPhysiotherapist = useCreatePhysiotherapist();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminCreatePhysiotherapistInput>({ resolver: zodResolver(AdminCreatePhysiotherapistSchema) });

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
          <Controller control={control} name="email" render={({ field }) => (
            <Field label="Email" value={field.value ?? ''} onChangeText={field.onChange} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          )} />
          <Controller control={control} name="password" render={({ field }) => (
            <Field label="Initial password" value={field.value ?? ''} onChangeText={field.onChange} secureTextEntry error={errors.password?.message} />
          )} />
          <Controller control={control} name="phone" render={({ field }) => (
            <Field label="Phone (optional)" value={field.value ?? ''} onChangeText={field.onChange} keyboardType="phone-pad" error={errors.phone?.message} />
          )} />
          <Controller control={control} name="licenseNumber" render={({ field }) => (
            <Field label="License number" value={field.value ?? ''} onChangeText={field.onChange} error={errors.licenseNumber?.message} />
          )} />
          <Controller control={control} name="specialty" render={({ field }) => (
            <Field label="Specialty" value={field.value ?? ''} onChangeText={field.onChange} placeholder="e.g. Orthopedic Rehabilitation" error={errors.specialty?.message} />
          )} />
          {createPhysiotherapist.isError ? <Text style={styles.errorText}>Could not create the account. Please try again.</Text> : null}
          <Text style={styles.hintText}>Share the email and password with the physiotherapist directly — there's no automated invite email.</Text>
          <Button
            title={createPhysiotherapist.isPending ? 'Creating…' : 'Create account'}
            onPress={handleSubmit((data) => createPhysiotherapist.mutate(data, { onSuccess: () => navigation.goBack() }))}
            disabled={createPhysiotherapist.isPending}
            loading={createPhysiotherapist.isPending}
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
  hintText: { fontFamily: fonts.regular, color: colors.textMuted, fontSize: 12, marginBottom: 12 },
});
