'use client';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils/cn';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...rest }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex h-9 items-center gap-1 rounded-md bg-surface-2 p-1', className)}
      {...rest}
    />
  );
});

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...rest }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium transition-all',
        'text-fg-muted hover:text-fg',
        'data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-xs',
        'focus-visible:outline-none focus-visible:shadow-ring',
        className,
      )}
      {...rest}
    />
  );
});

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...rest }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-3 focus-visible:outline-none', className)}
      {...rest}
    />
  );
});
