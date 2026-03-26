'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, KeyRound } from 'lucide-react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

const Schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type Values = z.infer<typeof Schema>;

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { email: 'admin@example.com', password: 'admin123' },
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      setError('Those credentials did not work. Try admin@example.com / admin123.');
      return;
    }
    const callbackUrl = search.get('callbackUrl') ?? '/';
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <div className="flex items-center justify-between">
          <span>
            New here?{' '}
            <Link className="font-medium text-primary hover:underline" href="/register">
              Create an account
            </Link>
          </span>
          <Link className="text-fg-muted hover:text-fg" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Email" error={form.formState.errors.email?.message} required>
          <Input
            type="email"
            autoComplete="email"
            leftAdornment={<Mail size={14} />}
            {...form.register('email')}
            invalid={!!form.formState.errors.email}
          />
        </FormField>
        <FormField label="Password" error={form.formState.errors.password?.message} required>
          <Input
            type="password"
            autoComplete="current-password"
            leftAdornment={<KeyRound size={14} />}
            {...form.register('password')}
            invalid={!!form.formState.errors.password}
          />
        </FormField>

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" loading={form.formState.isSubmitting} block size="lg">
          Sign in
        </Button>

        <p className="text-center text-xs text-fg-subtle">
          Demo accounts: <code className="font-mono text-fg-muted">admin / editor / viewer @example.com</code>{' '}
          (password = role + 123)
        </p>
      </form>
    </AuthLayout>
  );
}
