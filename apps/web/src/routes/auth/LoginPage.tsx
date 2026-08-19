import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { LoginSchema, type LoginInput } from '@ghar-doc/shared';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Field } from '../../components/ui/Field';

export function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-icon.png" alt="Ghar Doc" className="mb-2 h-16 w-16" />
          <h1 className="text-2xl font-bold">
            <span className="text-blue-700">Ghar</span>
            <span className="text-brand-600">Doc</span>
          </h1>
          <p className="text-sm text-slate-500">Doctor home visits, sorted.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit((data) => login.mutate(data))}>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" {...register('password')} />
          </Field>
          {login.isError && <p className="text-sm text-red-600">Invalid email or password.</p>}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-medium text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
