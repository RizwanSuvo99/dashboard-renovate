'use client';
import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Kbd } from '@/components/atoms/Kbd';
import { cn } from '@/lib/utils/cn';

export interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  /** Show a Cmd-K hint on the right. */
  showHint?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  showHint,
}: SearchBarProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftAdornment={<Search size={14} />}
        rightAdornment={
          value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onChange('')}
              className="text-fg-subtle hover:text-fg"
            >
              <X size={14} />
            </button>
          ) : showHint ? (
            <span className="hidden md:inline">
              <Kbd>⌘K</Kbd>
            </span>
          ) : null
        }
      />
    </div>
  );
}
