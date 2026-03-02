/**
 * Design tokens — single source of truth for the visual system.
 *
 * These are referenced by:
 *   - tailwind.config.ts (spacing, fontSize)
 *   - src/design-system/theme.ts (color palettes → CSS variables)
 *   - The /design-system route (rendered as the design-system docs)
 *
 * Usage in component code: prefer the Tailwind utilities (bg-primary,
 * text-fg-muted, rounded-md) that already consume these tokens via CSS vars.
 * Reach for tokens.ts directly only when building a primitive that has to
 * compute a value (e.g., generating a color ramp at runtime).
 */
export const tokens = {
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
    40: '160px',
    48: '192px',
    56: '224px',
    64: '256px',
  },
  fontSize: {
    '2xs': '0.6875rem',
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.9375rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  /**
   * Curated families. The theme customizer offers these as the only options —
   * we don't load arbitrary fonts at runtime.
   */
  fontFamilies: [
    { id: 'inter', label: 'Inter', value: 'Inter, ui-sans-serif, system-ui' },
    { id: 'geist', label: 'Geist', value: '"Geist Sans", ui-sans-serif, system-ui' },
    { id: 'sora', label: 'Sora', value: 'Sora, ui-sans-serif, system-ui' },
    { id: 'system', label: 'System', value: 'ui-sans-serif, system-ui, -apple-system' },
  ] as const,
  /**
   * Restrained palette presets — deliberately *not* indigo/purple.
   * Values are HSL channels (no alpha) so we can compose alpha at the
   * Tailwind layer via `<alpha-value>`.
   */
  colorPresets: [
    {
      id: 'emerald',
      label: 'Emerald',
      primary: '162 76% 30%',
      primaryFg: '0 0% 100%',
      primarySoft: '162 60% 92%',
      accent: '36 92% 52%',
      accentFg: '24 28% 14%',
      accentSoft: '36 92% 92%',
    },
    {
      id: 'slate',
      label: 'Graphite',
      primary: '217 33% 17%',
      primaryFg: '0 0% 100%',
      primarySoft: '217 33% 92%',
      accent: '24 95% 53%',
      accentFg: '24 28% 14%',
      accentSoft: '24 95% 93%',
    },
    {
      id: 'rose',
      label: 'Garnet',
      primary: '348 70% 42%',
      primaryFg: '0 0% 100%',
      primarySoft: '348 60% 94%',
      accent: '198 86% 38%',
      accentFg: '0 0% 100%',
      accentSoft: '198 60% 92%',
    },
    {
      id: 'ocean',
      label: 'Ocean',
      primary: '198 86% 30%',
      primaryFg: '0 0% 100%',
      primarySoft: '198 60% 92%',
      accent: '162 76% 36%',
      accentFg: '0 0% 100%',
      accentSoft: '162 60% 92%',
    },
  ] as const,
} as const;

export type ColorPreset = (typeof tokens.colorPresets)[number];
export type FontFamily = (typeof tokens.fontFamilies)[number];
