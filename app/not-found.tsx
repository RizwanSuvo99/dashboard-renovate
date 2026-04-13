import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="relative w-full max-w-md text-center">
        <div className="absolute inset-x-0 -top-10 -z-10 h-40 bg-dotted opacity-50" />
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <Compass size={28} />
        </div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          The page you were looking for doesn't exist, or it may have moved. Let's get you back on track.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline" leftIcon={<ArrowLeft size={14} />}>
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
