import type { Metadata } from 'next';
import { themeRepo } from '@/lib/repositories';
import { themeToCssVars, modeColors } from '@/design-system/theme';
import { Providers } from './providers';
import './globals.css';

// Fonts: tokens.ts + theme.ts wire the actual family via CSS vars
// (--font-sans / --font-display). The defaults fall through to a system
// stack, so the dashboard renders correctly without network access. To
// re-enable Google fonts, import next/font/google here and append the
// returned className to <html>.

export const metadata: Metadata = {
  title: {
    default: 'Renovate — Modern SaaS Dashboard',
    template: '%s · Renovate',
  },
  description: 'A reusable, customizable dashboard template built on Next.js, Tailwind, and an atomic design system.',
  icons: { icon: '/favicon.svg' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await themeRepo.get().catch(() => null);
  const initial = theme ?? {
    mode: 'system' as const,
    presetId: 'emerald' as const,
    radius: 'md' as const,
    fontFamilyId: 'inter' as const,
    sidebar: 'expanded' as const,
    brandName: 'Renovate',
  };

  // Build inline style string for SSR — prevents flash of wrong theme.
  const vars = { ...themeToCssVars(initial), ...modeColors(initial.mode === 'dark' ? 'dark' : 'light') };
  const inlineStyle = Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ');

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ cssText: inlineStyle } as React.CSSProperties}
      data-sidebar={initial.sidebar}
      data-preset={initial.presetId}
    >
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <Providers initialTheme={initial}>{children}</Providers>
      </body>
    </html>
  );
}
