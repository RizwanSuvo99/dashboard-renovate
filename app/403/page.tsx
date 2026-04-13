import Link from 'next/link';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-warning/10 text-[hsl(var(--warning))]">
          <ShieldOff size={28} />
        </div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">403</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
          You can't see that page
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Your role doesn't include access to this area. If you think this is a mistake, ping an admin.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" leftIcon={<ArrowLeft size={14} />}>
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
