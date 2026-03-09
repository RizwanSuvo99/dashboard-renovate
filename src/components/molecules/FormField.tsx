import * as React from 'react';
import { Label } from '@/components/atoms/Label';
import { cn } from '@/lib/utils/cn';

export interface FormFieldProps {
  /** Field label text. */
  label?: React.ReactNode;
  /** Helper text shown below the field. Hidden if `error` is set. */
  description?: React.ReactNode;
  /** Validation error message — when truthy, replaces description. */
  error?: React.ReactNode;
  /** Mark the label with a required asterisk. */
  required?: boolean;
  /** Optional id (passed via context to children via cloneElement-by-htmlFor). */
  htmlFor?: string;
  /** The control: an Input, Textarea, Select, etc. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a label, control, and error into a single unit.
 * Use in any react-hook-form integration:
 *   <FormField label="Email" error={errors.email?.message} required>
 *     <Input {...register('email')} />
 *   </FormField>
 */
export function FormField({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : description ? (
        <p className="text-xs text-fg-subtle">{description}</p>
      ) : null}
    </div>
  );
}
