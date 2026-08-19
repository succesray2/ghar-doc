import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateVisitSchema, type CreateVisitInput } from '@ghar-doc/shared';
import { useCreateVisit } from '../../hooks/useVisits';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme/colors';
import type { PatientStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<PatientStackParamList, 'RequestVisit'>;

export function RequestVisitScreen({ navigation, route }: Props) {
  const createVisit = useCreateVisit();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateVisitInput>({ resolver: zodResolver(CreateVisitSchema) });

  // Service tiles on Home can deep-link here with a starting hint — the
  // booking flow is still one generic text field either way (the API has
  // no per-service intake), this just seeds it instead of leaving it blank.
  useEffect(() => {
    if (route.params?.reasonHint) {
      setValue('reasonForVisit', route.params.reasonHint);
    }
  }, [route.params?.reasonHint, setValue]);

  const onSubmit = handleSubmit((data) => {
    createVisit.mutate(data, {
      onSuccess: () => {
        reset();
        navigation.navigate('PatientTabs', { screen: 'MyVisits' });
      },
    });
  });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Text style={styles.title}>Request a home visit</Text>
          <Controller control={control} name="reasonForVisit" render={({ field }) => (
            <Field label="Reason for visit" value={field.value ?? ''} onChangeText={field.onChange} placeholder="e.g. Fever and body ache for 2 days" error={errors.reasonForVisit?.message} />
          )} />
          <Controller control={control} name="notes" render={({ field }) => (
            <Field label="Additional notes (optional)" value={field.value ?? ''} onChangeText={field.onChange} multiline />
          )} />
          <Controller control={control} name="addressLine1" render={({ field }) => (
            <Field label="Address line 1" value={field.value ?? ''} onChangeText={field.onChange} error={errors.addressLine1?.message} />
          )} />
          <Controller control={control} name="addressLine2" render={({ field }) => (
            <Field label="Address line 2 (optional)" value={field.value ?? ''} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="city" render={({ field }) => (
            <Field label="City" value={field.value ?? ''} onChangeText={field.onChange} error={errors.city?.message} />
          )} />
          <Controller control={control} name="state" render={({ field }) => (
            <Field label="State" value={field.value ?? ''} onChangeText={field.onChange} error={errors.state?.message} />
          )} />
          <Controller control={control} name="postalCode" render={({ field }) => (
            <Field label="Postal code" value={field.value ?? ''} onChangeText={field.onChange} keyboardType="number-pad" error={errors.postalCode?.message} />
          )} />
          {createVisit.isError ? <Text style={styles.errorText}>Could not submit request. Please try again.</Text> : null}
          <Button
            title={createVisit.isPending ? 'Submitting…' : 'Request visit'}
            onPress={onSubmit}
            disabled={createVisit.isPending}
            loading={createVisit.isPending}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 13, marginBottom: 12 },
});
