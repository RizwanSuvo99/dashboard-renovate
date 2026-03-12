'use client';
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: Array<{ value: T; label: React.ReactNode; icon?: React.ReactNode }>;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md bg-surface-2 p-0.5',
        size === 'sm' ? 'h-8' : 'h-9',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 text-sm font-medium transition-all',
              size === 'sm' ? 'h-7' : 'h-8',
              active ? 'bg-surface text-fg shadow-xs' : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
