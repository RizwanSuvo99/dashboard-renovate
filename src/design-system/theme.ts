import { tokens, type ColorPreset } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';
export type RadiusScale = 'sm' | 'md' | 'lg';
export type SidebarStyle = 'compact' | 'expanded' | 'floating';

export interface ThemeConfig {
  mode: ThemeMode;
  presetId: ColorPreset['id'];
  radius: RadiusScale;
  fontFamilyId: (typeof tokens.fontFamilies)[number]['id'];
  sidebar: SidebarStyle;
  brandName: string;
}

export const defaultTheme: ThemeConfig = {
  mode: 'system',
  presetId: 'emerald',
  radius: 'md',
  fontFamilyId: 'inter',
  sidebar: 'expanded',
  brandName: 'Renovate',
};

const lightSurface = {
  bg: '210 40% 99%',
  surface: '0 0% 100%',
  surface2: '210 30% 97%',
  border: '215 20% 91%',
  ring: '162 76% 30%',
  fg: '222 36% 14%',
  fgMuted: '218 14% 38%',
  fgSubtle: '218 12% 56%',
};

const darkSurface = {
  bg: '222 36% 7%',
  surface: '222 32% 10%',
  surface2: '222 28% 13%',
  border: '222 18% 20%',
  ring: '162 76% 50%',
  fg: '210 40% 96%',
  fgMuted: '218 12% 70%',
  fgSubtle: '218 10% 52%',
};

const status = {
  success: '152 60% 36%',
  warning: '38 92% 50%',
  danger: '0 72% 50%',
  info: '210 90% 50%',
};

export function resolvePreset(presetId: ColorPreset['id']): ColorPreset {
  return tokens.colorPresets.find((p) => p.id === presetId) ?? tokens.colorPresets[0];
}

export function radiusValue(scale: RadiusScale): string {
  return tokens.radius[scale];
}

/**
 * Build the inline `style` declaration block for a theme — a string of
 * `--var: value;` pairs that can be applied to <html> via `style.cssText`.
 *
 * We deliberately do NOT generate two separate stylesheets for light/dark.
 * Instead, the HTML element gets:
 *   - The mode class (`dark` or `light`) which switches `bg`/`fg` via the
 *     CSS rules in globals.css, and
 *   - The preset/radius/font variables that apply to both modes.
 */
export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const preset = resolvePreset(theme.presetId);
  const family = tokens.fontFamilies.find((f) => f.id === theme.fontFamilyId)
    ?? tokens.fontFamilies[0];

  return {
    '--primary': preset.primary,
    '--primary-fg': preset.primaryFg,
    '--primary-soft': preset.primarySoft,
    '--accent': preset.accent,
    '--accent-fg': preset.accentFg,
    '--accent-soft': preset.accentSoft,
    '--success': status.success,
    '--warning': status.warning,
    '--danger': status.danger,
    '--info': status.info,
    '--radius': radiusValue(theme.radius),
    '--font-sans': family.value,
    '--font-display': family.value,
    '--font-mono': 'ui-monospace, SFMono-Regular, Menlo, monospace',
  };
}

export function modeColors(mode: 'light' | 'dark') {
  const set = mode === 'dark' ? darkSurface : lightSurface;
  return {
    '--bg': set.bg,
    '--surface': set.surface,
    '--surface-2': set.surface2,
    '--border': set.border,
    '--ring': set.ring,
    '--fg': set.fg,
    '--fg-muted': set.fgMuted,
    '--fg-subtle': set.fgSubtle,
  } as Record<string, string>;
}

/**
 * Apply theme to the document. Used by ThemeProvider on the client and by the
 * theme customizer for live preview.
 */
export function applyThemeToDocument(theme: ThemeConfig, doc: Document = document) {
  const root = doc.documentElement;
  const vars = themeToCssVars(theme);
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);

  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = theme.mode === 'system' ? (prefersDark ? 'dark' : 'light') : theme.mode;
  const modeVars = modeColors(effectiveMode);
  for (const [k, v] of Object.entries(modeVars)) root.style.setProperty(k, v);

  root.classList.toggle('dark', effectiveMode === 'dark');
  root.dataset.sidebar = theme.sidebar;
  root.dataset.preset = theme.presetId;
}
