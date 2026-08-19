import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CreateVisitSchema, type CreateVisitInput } from '@ghar-doc/shared';
import { useCreateVisit } from '../../hooks/useVisits';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';

export function RequestVisitPage() {
  const createVisit = useCreateVisit();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVisitInput>({ resolver: zodResolver(CreateVisitSchema) });

  return (
    <Card className="mx-auto max-w-xl">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Request a home visit</h2>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => createVisit.mutate(data, { onSuccess: () => navigate('/patient/visits') }))}
      >
        <Field label="Reason for visit" error={errors.reasonForVisit?.message}>
          <Input placeholder="e.g. Fever and body ache for 2 days" {...register('reasonForVisit')} />
        </Field>
        <Field label="Additional notes (optional)">
          <Input {...register('notes')} />
        </Field>
        <Field label="Address line 1" error={errors.addressLine1?.message}>
          <Input {...register('addressLine1')} />
        </Field>
        <Field label="Address line 2 (optional)">
          <Input {...register('addressLine2')} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="City" error={errors.city?.message}>
            <Input {...register('city')} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <Input {...register('state')} />
          </Field>
          <Field label="Postal code" error={errors.postalCode?.message}>
            <Input {...register('postalCode')} />
          </Field>
        </div>
        {createVisit.isError && <p className="text-sm text-red-600">Could not submit request. Please try again.</p>}
        <Button type="submit" className="w-full" disabled={createVisit.isPending}>
          {createVisit.isPending ? 'Submitting…' : 'Request visit'}
        </Button>
      </form>
    </Card>
  );
}
