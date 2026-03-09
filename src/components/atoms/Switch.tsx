'use client';
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils/cn';

/**
 * Boolean toggle. Pair with `<Label>` for form usage.
 * @example <Switch checked={value} onCheckedChange={setValue} />
 */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(function Switch({ className, ...rest }, ref) {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors',
        'data-[state=unchecked]:bg-surface-2 data-[state=checked]:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform',
          'data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitives.Root>
  );
});
