import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  /** Lucide icon node. */
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** CTA button(s). */
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Delightful empty state. Ships with a soft halo behind the icon so list-zero
 * states feel intentional rather than like a missing render.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'sm' && 'py-8 px-4',
        size === 'md' && 'py-14 px-6',
        size === 'lg' && 'py-24 px-8',
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            'relative mb-4 flex items-center justify-center rounded-full bg-primary-soft text-primary',
            size === 'sm' && 'h-10 w-10',
            size === 'md' && 'h-14 w-14',
            size === 'lg' && 'h-16 w-16',
          )}
        >
          <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/10 blur-2xl" />
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>
      )}
      {action && <div className="mt-5 flex items-center gap-2">{action}</div>}
    </div>
  );
}
