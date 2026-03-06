'use client';
import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { initials } from '@/lib/utils/format';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<Size, string> = {
  xs: 'h-6 w-6 text-2xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-md',
  xl: 'h-14 w-14 text-lg',
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  name: string;
  size?: Size;
  /** Render a small status dot in the bottom-right. */
  status?: 'online' | 'busy' | 'offline';
}

/** Avatar with name-derived initials fallback. */
export function Avatar({ className, src, name, size = 'md', status, ...rest }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = !!src && !errored;
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 font-medium text-fg-muted',
        sizes[size],
        className,
      )}
      aria-label={name}
      {...rest}
    >
      {showImage ? (
        <img
          src={src!}
          alt={name}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials(name) || '?'}</span>
      )}
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-surface',
            status === 'online' && 'bg-success',
            status === 'busy' && 'bg-warning',
            status === 'offline' && 'bg-fg-subtle',
          )}
        />
      )}
    </span>
  );
}

export function AvatarGroup({
  members,
  max = 4,
  size = 'sm',
}: {
  members: Array<{ name: string; src?: string | null }>;
  max?: number;
  size?: Size;
}) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((m, i) => (
        <Avatar key={i} {...m} size={size} className="ring-2 ring-surface" />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-surface-2 font-medium text-fg-muted ring-2 ring-surface',
            sizes[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
