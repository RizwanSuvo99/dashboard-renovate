'use client';
import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  indeterminate?: boolean;
  size?: 'sm' | 'md';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, indeterminate, checked, size = 'md', ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current!);
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <input
        ref={innerRef}
        type="checkbox"
        checked={checked}
        className={cn(
          'peer appearance-none rounded border border-border bg-surface transition-colors',
          'checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary',
          'focus:outline-none focus-visible:shadow-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          dimension,
        )}
        {...rest}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-primary-fg opacity-0 peer-checked:opacity-100">
        <Check size={size === 'sm' ? 10 : 12} strokeWidth={3} />
      </span>
      {indeterminate && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-primary-fg">
          <Minus size={size === 'sm' ? 10 : 12} strokeWidth={3} />
        </span>
      )}
    </span>
  );
});
