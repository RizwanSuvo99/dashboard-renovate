'use client';
import * as React from 'react';
import { Check } from 'lucide-react';
import { tokens, type ColorPreset } from '@/design-system/tokens';
import { cn } from '@/lib/utils/cn';

export interface ColorPickerProps {
  value: ColorPreset['id'];
  onChange: (id: ColorPreset['id']) => void;
  className?: string;
}

/** Preset color picker — only offers curated palettes (no arbitrary hex). */
export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {tokens.colorPresets.map((preset) => {
        const active = preset.id === value;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={cn(
              'group flex items-center gap-2 rounded-md border bg-surface p-2 text-left text-sm transition-all hover:shadow-xs',
              active ? 'border-primary shadow-ring' : 'border-border',
            )}
            aria-pressed={active}
          >
            <span
              aria-hidden="true"
              className="relative h-7 w-7 shrink-0 overflow-hidden rounded"
              style={{ background: `hsl(${preset.primary})` }}
            >
              <span
                className="absolute right-0 top-0 h-full w-1/2"
                style={{ background: `hsl(${preset.accent})` }}
              />
              {active && (
                <span className="absolute inset-0 grid place-items-center text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </span>
            <span>
              <span className="block font-medium">{preset.label}</span>
              <span className="block text-2xs text-fg-subtle">primary · accent</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
