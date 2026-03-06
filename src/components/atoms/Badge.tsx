import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
type Size = 'sm' | 'md';

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg-muted border-border',
  primary: 'bg-primary-soft text-primary border-primary/10',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-[hsl(var(--warning))] border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-info/10 text-info border-info/20',
  accent: 'bg-accent-soft text-accent-fg border-accent/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-5 px-1.5 text-2xs gap-1',
  md: 'h-6 px-2 text-xs gap-1.5',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  /** Render a small leading status dot. */
  dot?: boolean;
}

/**
 * Compact status / tag chip.
 * @example <Badge tone="success" dot>Active</Badge>
 */
export function Badge({ className, tone = 'neutral', size = 'md', dot, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        tones[tone],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-fg-muted': tone === 'neutral',
            'bg-primary': tone === 'primary',
            'bg-success': tone === 'success',
            'bg-warning': tone === 'warning',
            'bg-danger': tone === 'danger',
            'bg-info': tone === 'info',
            'bg-accent': tone === 'accent',
          })}
        />
      )}
      {children}
    </span>
  );
}
