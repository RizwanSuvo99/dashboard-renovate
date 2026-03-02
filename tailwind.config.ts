import type { Config } from 'tailwindcss';
import { tokens } from './src/design-system/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        'fg-muted': 'hsl(var(--fg-muted) / <alpha-value>)',
        'fg-subtle': 'hsl(var(--fg-subtle) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          fg: 'hsl(var(--primary-fg) / <alpha-value>)',
          soft: 'hsl(var(--primary-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          fg: 'hsl(var(--accent-fg) / <alpha-value>)',
          soft: 'hsl(var(--accent-soft) / <alpha-value>)',
        },
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
        info: 'hsl(var(--info) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif'],
      },
      fontSize: tokens.fontSize as Record<string, string>,
      spacing: tokens.spacing,
      boxShadow: {
        xs: '0 1px 2px 0 hsl(220 40% 10% / 0.05)',
        sm: '0 1px 3px 0 hsl(220 40% 10% / 0.08), 0 1px 2px -1px hsl(220 40% 10% / 0.06)',
        md: '0 4px 12px -2px hsl(220 40% 10% / 0.10), 0 2px 6px -2px hsl(220 40% 10% / 0.06)',
        lg: '0 12px 28px -6px hsl(220 40% 10% / 0.14), 0 4px 10px -4px hsl(220 40% 10% / 0.08)',
        ring: '0 0 0 3px hsl(var(--ring) / 0.35)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
