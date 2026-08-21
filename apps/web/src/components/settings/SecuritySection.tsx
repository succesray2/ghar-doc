import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSchema, type ChangePasswordInput } from '@ghar-doc/shared';
import { useChangePassword, useLogoutAllDevices, useSessions } from '../../hooks/useAccount';
import { Card } from '../ui/Card';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SecuritySection() {
  const changePassword = useChangePassword();
  const logoutAll = useLogoutAllDevices();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(ChangePasswordSchema) });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-4 text-base font-semibold text-slate-800">Change password</h2>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            changePassword.mutate(data, { onError: () => reset(data) });
          })}
        >
          <Field label="Current password" error={errors.currentPassword?.message}>
            <Input type="password" {...register('currentPassword')} />
          </Field>
          <Field label="New password" error={errors.newPassword?.message}>
            <Input type="password" {...register('newPassword')} />
          </Field>
          {changePassword.isError && (
            <p className="text-sm text-red-600">Could not change password — check your current password and try again.</p>
          )}
          <p className="text-xs text-slate-400">Changing your password signs you out everywhere, including this device.</p>
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Updating…' : 'Change password'}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Active sessions</h2>
          <Button variant="secondary" onClick={() => logoutAll.mutate()} disabled={logoutAll.isPending}>
            Log out all devices
          </Button>
        </div>
        {sessionsLoading ? (
          <p className="text-sm text-slate-500">Loading sessions…</p>
        ) : !sessions || sessions.length === 0 ? (
          <p className="text-sm text-slate-500">No active sessions.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
                <span className="text-slate-700">{s.userAgent ?? 'Unknown device'}</span>
                <span className="text-xs text-slate-400">Signed in {new Date(s.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
