import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminCreatePhysiotherapistSchema, type AdminCreatePhysiotherapistInput } from '@ghar-doc/shared';
import { useCreatePhysiotherapist } from '../../hooks/usePhysiotherapists';
import { Field } from '../../components/ui/Field';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function CreatePhysiotherapistDialog({ onClose }: { onClose: () => void }) {
  const createPhysiotherapist = useCreatePhysiotherapist();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminCreatePhysiotherapistInput>({ resolver: zodResolver(AdminCreatePhysiotherapistSchema) });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Add a physiotherapist account</h3>
        <form
          className="space-y-3"
          onSubmit={handleSubmit((data) => createPhysiotherapist.mutate(data, { onSuccess: onClose }))}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={errors.firstName?.message}>
              <Input {...register('firstName')} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input {...register('lastName')} />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </Field>
          <Field label="Initial password" error={errors.password?.message}>
            <Input type="password" {...register('password')} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <Input {...register('phone')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="License number" error={errors.licenseNumber?.message}>
              <Input {...register('licenseNumber')} />
            </Field>
            <Field label="Specialty" error={errors.specialty?.message}>
              <Input placeholder="e.g. Orthopedic Rehabilitation" {...register('specialty')} />
            </Field>
          </div>
          <Field label="Years of experience (optional)" error={errors.yearsExperience?.message}>
            <Input type="number" min={0} {...register('yearsExperience')} />
          </Field>
          {createPhysiotherapist.isError && (
            <p className="text-sm text-red-600">Could not create the account — check the details and try again.</p>
          )}
          <p className="text-xs text-slate-400">
            Share the email and password with the physiotherapist directly — there's no automated invite email.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPhysiotherapist.isPending}>
              {createPhysiotherapist.isPending ? 'Creating…' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
