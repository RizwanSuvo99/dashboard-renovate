'use client';
import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle size={28} />
        </div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-danger">500</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
          Something went sideways
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          An unexpected error occurred. Try again, or head back to safety.
        </p>
        {error.digest && (
          <p className="mt-2 inline-block rounded bg-surface-2 px-2 py-1 font-mono text-2xs text-fg-subtle">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} leftIcon={<RefreshCw size={14} />}>Try again</Button>
          <Button asChild variant="outline" leftIcon={<ArrowLeft size={14} />}>
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
