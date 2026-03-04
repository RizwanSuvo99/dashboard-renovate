import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'subtle' | 'link';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary/90 active:bg-primary/95 shadow-xs disabled:bg-primary/40',
  secondary:
    'bg-surface-2 text-fg border border-border hover:bg-surface-2/70 active:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2 active:bg-surface-2/70',
  outline: 'border border-border text-fg hover:bg-surface-2 active:bg-surface-2/70',
  danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger',
  subtle: 'bg-primary-soft text-primary hover:bg-primary-soft/80',
  link: 'text-primary underline-offset-4 hover:underline px-0 h-auto',
};

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-md gap-2',
  icon: 'h-9 w-9 shrink-0',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. */
  variant?: Variant;
  /** Size preset. */
  size?: Size;
  /** Render as the child element (composition with `<Link>` etc.). */
  asChild?: boolean;
  /** Show a leading spinner and disable the button. */
  loading?: boolean;
  /** Optional leading icon node. */
  leftIcon?: React.ReactNode;
  /** Optional trailing icon node. */
  rightIcon?: React.ReactNode;
  /** Make the button stretch to its container. */
  block?: boolean;
}

/**
 * Primary action button. Composes with `asChild` to wrap any element
 * (e.g., `<Button asChild><Link href="/x">Go</Link></Button>`).
 *
 * @example
 *   <Button variant="primary" size="md" leftIcon={<Plus />}>New</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    asChild,
    loading,
    leftIcon,
    rightIcon,
    block,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref as React.Ref<HTMLButtonElement>}
      type={asChild ? undefined : type}
      data-loading={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-[background,box-shadow,color]',
        'select-none disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}
      <Slottable>{children}</Slottable>
      {!loading && rightIcon}
    </Comp>
  );
});

