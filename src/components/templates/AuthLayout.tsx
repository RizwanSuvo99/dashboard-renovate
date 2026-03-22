import * as React from 'react';
import Link from 'next/link';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Footer link block ("Don't have an account?"). */
  footer?: React.ReactNode;
  /** Side panel content — defaults to a branded marketing pitch. */
  aside?: React.ReactNode;
}

/** Split-screen branded auth layout. Left = form, right = branded panel. */
export function AuthLayout({ title, subtitle, children, footer, aside }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg">
      <main className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-[55%] lg:px-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-fg font-display">
            R
          </span>
          <span className="font-display">Renovate</span>
        </Link>

        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-fg-muted">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-8 border-t border-border pt-5 text-sm text-fg-muted">{footer}</div>}
        </div>

        <p className="mt-auto text-xs text-fg-subtle">
          © {new Date().getFullYear()} Renovate Template — built as an open foundation.
        </p>
      </main>
      <aside className="hidden lg:flex lg:w-[45%] auth-aurora">
        <div className="m-auto max-w-md px-10 py-12">
          {aside ?? <DefaultAside />}
        </div>
      </aside>
    </div>
  );
}

function DefaultAside() {
  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-surface/70 px-3 py-1 text-xs font-medium text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Built for serious teams
      </div>
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg">
        A dashboard you'd actually want to keep open all day.
      </h2>
      <p className="text-sm leading-relaxed text-fg-muted">
        Renovate ships with an atomic component system, theme customizer, dynamic
        page builder, and a repository-pattern data layer — so it scales with
        whatever shape your product takes next.
      </p>
      <ul className="space-y-2 text-sm text-fg-muted">
        {[
          'Live theme customization without redeploys',
          'Drag-and-drop page & navigation builder',
          'RBAC out of the box (admin / editor / viewer)',
          'Designed first, then engineered',
        ].map((line) => (
          <li key={line} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
