import { cn } from '@/lib/utils/cn';

/** Indeterminate spinner. */
export function Spinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-r-transparent text-fg-subtle',
        size === 'sm' && 'h-3.5 w-3.5 border-[1.5px]',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-6 w-6',
        className,
      )}
    />
  );
}
