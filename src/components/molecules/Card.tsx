import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Card primitive — bg-surface + border + radius + optional padding.
 * Compose with CardHeader / CardBody / CardFooter for structure.
 */
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(function Card({ className, interactive, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'surface',
        interactive && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...rest}
    />
  );
});

export function CardHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-start justify-between gap-3 border-b border-border px-5 py-4', className)}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-md font-semibold tracking-tight text-fg', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-fg-muted', className)} {...rest} />;
}

export function CardBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 border-t border-border px-5 py-3', className)}
      {...rest}
    />
  );
}
