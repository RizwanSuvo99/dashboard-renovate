'use client';
import * as React from 'react';
import { create } from 'zustand';
import { applyThemeToDocument, defaultTheme, type ThemeConfig } from '@/design-system/theme';

interface ThemeStore {
  theme: ThemeConfig;
  setTheme: (next: ThemeConfig, opts?: { persist?: boolean }) => void;
  hydrate: (next: ThemeConfig) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: defaultTheme,
  setTheme: (next, opts = { persist: true }) => {
    if (typeof document !== 'undefined') applyThemeToDocument(next);
    if (opts.persist) {
      void fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
    }
    set({ theme: next });
  },
  hydrate: (next) => {
    if (typeof document !== 'undefined') applyThemeToDocument(next);
    set({ theme: next });
  },
}));

/** Returns the active theme config and a setter that persists via /api/theme. */
export function useTheme() {
  return useThemeStore();
}

/** Hydrate the store on mount with theme loaded server-side. */
export function ThemeHydrator({ initialTheme }: { initialTheme: ThemeConfig }) {
  const hydrate = useThemeStore((s) => s.hydrate);
  React.useEffect(() => {
    hydrate(initialTheme);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => hydrate(initialTheme);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [hydrate, initialTheme]);
  return null;
}
