import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema, type UpdateProfileInput } from '@ghar-doc/shared';
import { useAuthStore } from '../../lib/auth-store';
import { useUpdateProfile } from '../../hooks/useAccount';
import { Card } from '../ui/Card';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone ?? undefined },
  });

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-slate-800">Profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit((data) => updateProfile.mutate(data))}>
        <Field label="Email">
          <Input value={user?.email ?? ''} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName?.message}>
            <Input {...register('firstName')} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input {...register('lastName')} />
          </Field>
        </div>
        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register('phone')} />
        </Field>
        {updateProfile.isSuccess && <p className="text-sm text-brand-600">Profile updated.</p>}
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </Card>
  );
}
