import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { themeRepo } from '@/lib/repositories';
import { themeToCssVars, modeColors } from '@/design-system/theme';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

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
      className={`${inter.variable} ${sora.variable}`}
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
