import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'flex h-9 w-full appearance-none rounded-md border border-border bg-surface px-3 pr-9 text-sm transition-colors',
          'focus:border-primary focus:outline-none focus:shadow-ring',
          'disabled:cursor-not-allowed disabled:opacity-60',
          invalid && 'border-danger focus:border-danger',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-subtle"
      />
    </div>
  );
});
