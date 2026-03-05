import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show invalid styling (red ring + border). Wired up by FormField when there's an error. */
  invalid?: boolean;
  /** Optional leading adornment (icon, prefix). */
  leftAdornment?: React.ReactNode;
  /** Optional trailing adornment. */
  rightAdornment?: React.ReactNode;
}

/**
 * Native text input. Wrap with `<FormField>` to get a label + error in one.
 *
 * @example
 *   <Input placeholder="Search…" leftAdornment={<Search size={14} />} />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, leftAdornment, rightAdornment, ...rest },
  ref,
) {
  if (leftAdornment || rightAdornment) {
    return (
      <div
        className={cn(
          'relative flex h-9 items-center rounded-md border bg-surface text-sm transition-colors',
          'border-border focus-within:border-primary focus-within:shadow-ring',
          invalid && 'border-danger focus-within:border-danger focus-within:shadow-[0_0_0_3px_hsl(var(--danger)/0.3)]',
          className,
        )}
      >
        {leftAdornment && (
          <span className="pointer-events-none flex h-full items-center pl-2.5 text-fg-subtle">
            {leftAdornment}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'flex-1 bg-transparent px-2.5 outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed disabled:opacity-60',
            leftAdornment && 'pl-2',
            rightAdornment && 'pr-2',
          )}
          {...rest}
        />
        {rightAdornment && (
          <span className="flex h-full items-center pr-2 text-fg-subtle">{rightAdornment}</span>
        )}
      </div>
    );
  }

  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-border bg-surface px-3 text-sm transition-colors',
        'placeholder:text-fg-subtle',
        'focus:border-primary focus:outline-none focus:shadow-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        invalid && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_hsl(var(--danger)/0.3)]',
        className,
      )}
      {...rest}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full min-h-[80px] rounded-md border border-border bg-surface px-3 py-2 text-sm transition-colors',
        'placeholder:text-fg-subtle resize-y',
        'focus:border-primary focus:outline-none focus:shadow-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        invalid && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_hsl(var(--danger)/0.3)]',
        className,
      )}
      {...rest}
    />
  );
});
