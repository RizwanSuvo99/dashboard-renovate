import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/** Form label. Pairs with Input/Textarea/Switch via htmlFor. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, required, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn('text-sm font-medium leading-none text-fg', className)}
      {...rest}
    >
      {children}
      {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
    </label>
  );
});
