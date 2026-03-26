'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, KeyRound, User as UserIcon } from 'lucide-react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

const Schema = z
  .object({
    name: z.string().min(2, 'Tell us your name'),
    email: z.string().email(),
    password: z.string().min(6, 'At least 6 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

type Values = z.infer<typeof Schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async (values: Values) => {
    setServerError(null);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error || 'Could not create your account.');
      return;
    }
    const signed = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signed?.error) {
      setServerError('Account created but sign-in failed. Please log in.');
      router.push('/login');
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Two minutes — and your dashboard is ready."
      footer={
        <span>
          Already with us?{' '}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Full name" error={form.formState.errors.name?.message} required>
          <Input
            leftAdornment={<UserIcon size={14} />}
            {...form.register('name')}
            invalid={!!form.formState.errors.name}
          />
        </FormField>
        <FormField label="Work email" error={form.formState.errors.email?.message} required>
          <Input
            type="email"
            autoComplete="email"
            leftAdornment={<Mail size={14} />}
            {...form.register('email')}
            invalid={!!form.formState.errors.email}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Password" error={form.formState.errors.password?.message} required>
            <Input
              type="password"
              autoComplete="new-password"
              leftAdornment={<KeyRound size={14} />}
              {...form.register('password')}
              invalid={!!form.formState.errors.password}
            />
          </FormField>
          <FormField label="Confirm" error={form.formState.errors.confirm?.message} required>
            <Input
              type="password"
              autoComplete="new-password"
              leftAdornment={<KeyRound size={14} />}
              {...form.register('confirm')}
              invalid={!!form.formState.errors.confirm}
            />
          </FormField>
        </div>

        {serverError && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={form.formState.isSubmitting} block size="lg">
          Create account
        </Button>
        <p className="text-center text-xs text-fg-subtle">
          By continuing you agree to our placeholder Terms and Privacy notice.
        </p>
      </form>
    </AuthLayout>
  );
}
