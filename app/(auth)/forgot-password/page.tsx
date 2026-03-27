'use client';
import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

const Schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof Schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const form = useForm<Values>({ resolver: zodResolver(Schema), defaultValues: { email: '' } });

  const onSubmit = async () => {
    // UI-only — no transactional email service wired up. See CLAUDE.md.
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
  };

  return (
    <AuthLayout
      title={sent ? 'Check your inbox' : 'Reset your password'}
      subtitle={sent ? 'We sent a recovery link to that address.' : 'We will email you a link to reset it.'}
      footer={
        <span>
          Back to{' '}
          <Link className="font-medium text-primary hover:underline" href="/login">
            sign in
          </Link>
        </span>
      }
    >
      {sent ? (
        <div className="flex flex-col items-start gap-4 rounded-lg border border-success/30 bg-success/5 p-5 text-sm">
          <CheckCircle2 className="text-success" size={28} />
          <div>
            <p className="font-medium text-fg">Recovery email sent</p>
            <p className="mt-1 text-fg-muted">
              If <span className="font-mono text-fg">{form.getValues('email')}</span> matches an account, you'll receive a link
              within a minute. (This template does not actually send email — see CLAUDE.md to wire up SMTP.)
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Email" error={form.formState.errors.email?.message} required>
            <Input
              type="email"
              leftAdornment={<Mail size={14} />}
              autoComplete="email"
              {...form.register('email')}
              invalid={!!form.formState.errors.email}
            />
          </FormField>
          <Button type="submit" loading={form.formState.isSubmitting} block size="lg">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
