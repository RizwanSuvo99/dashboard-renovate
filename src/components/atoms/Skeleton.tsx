import { cn } from '@/lib/utils/cn';

/** Loading shimmer block. */
export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('shimmer relative overflow-hidden rounded-md bg-surface-2', className)}
      {...rest}
    />
  );
}
