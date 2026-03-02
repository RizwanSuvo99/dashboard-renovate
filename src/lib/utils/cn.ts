import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class strings with conflict-aware Tailwind merging.
 * @example cn('px-2', condition && 'px-4', 'text-sm') // → 'px-4 text-sm'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
