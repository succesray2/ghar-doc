import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  SignupPatientSchema,
  SignupDoctorSchema,
  type SignupPatientInput,
  type SignupDoctorInput,
} from '@ghar-doc/shared';
import { useSignupPatient, useSignupDoctor } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Field } from '../../components/ui/Field';

type Tab = 'patient' | 'doctor';

export function SignupPage() {
  const [tab, setTab] = useState<Tab>('patient');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo-icon.png" alt="Ghar Doc" className="mb-2 h-16 w-16" />
          <h1 className="text-2xl font-bold">
            <span className="text-blue-700">Ghar</span>
            <span className="text-brand-600">Doc</span>
          </h1>
          <p className="text-sm text-slate-500">Create your account</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1 text-sm">
          <button
            type="button"
            className={clsx(
              'rounded px-3 py-1.5 font-medium',
              tab === 'patient' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500',
            )}
            onClick={() => setTab('patient')}
          >
            I&apos;m a patient
          </button>
          <button
            type="button"
            className={clsx(
              'rounded px-3 py-1.5 font-medium',
              tab === 'doctor' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500',
            )}
            onClick={() => setTab('doctor')}
          >
            I&apos;m a doctor
          </button>
        </div>

        {tab === 'patient' ? <PatientSignupForm /> : <DoctorSignupForm />}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

function PatientSignupForm() {
  const signup = useSignupPatient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPatientInput>({ resolver: zodResolver(SignupPatientSchema) });

  return (
    <form className="space-y-3" onSubmit={handleSubmit((data) => signup.mutate(data))}>
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
      <Field label="Password" error={errors.password?.message}>
        <Input type="password" {...register('password')} />
      </Field>
      <Field label="Phone (optional)">
        <Input {...register('phone')} />
      </Field>
      <Field label="Address line 1" error={errors.addressLine1?.message}>
        <Input {...register('addressLine1')} />
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
      {signup.isError && <p className="text-sm text-red-600">Could not create account. Try a different email.</p>}
      <Button type="submit" className="w-full" disabled={signup.isPending}>
        {signup.isPending ? 'Creating account…' : 'Create patient account'}
      </Button>
    </form>
  );
}

function DoctorSignupForm() {
  const signup = useSignupDoctor();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDoctorInput>({ resolver: zodResolver(SignupDoctorSchema) });

  return (
    <form className="space-y-3" onSubmit={handleSubmit((data) => signup.mutate(data))}>
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
      <Field label="Password" error={errors.password?.message}>
        <Input type="password" {...register('password')} />
      </Field>
      <Field label="Phone (optional)">
        <Input {...register('phone')} />
      </Field>
      <Field label="Medical license number" error={errors.licenseNumber?.message}>
        <Input {...register('licenseNumber')} />
      </Field>
      <Field label="Specialty" error={errors.specialty?.message}>
        <Input {...register('specialty')} />
      </Field>
      <Field label="Years of experience (optional)">
        <Input type="number" {...register('yearsExperience')} />
      </Field>
      <p className="text-xs text-slate-500">Your account will need admin approval before you can be assigned visits.</p>
      {signup.isError && <p className="text-sm text-red-600">Could not create account. Try a different email.</p>}
      <Button type="submit" className="w-full" disabled={signup.isPending}>
        {signup.isPending ? 'Creating account…' : 'Create doctor account'}
      </Button>
    </form>
  );
}
