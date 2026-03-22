'use client';
import * as React from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import type { NavItem } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils/cn';

export interface DashboardLayoutProps {
  user: { name: string; email: string; role: string; avatarUrl?: string | null };
  navigation: NavItem[];
  unreadNotifications?: number;
  pageTitle?: string;
  pageDescription?: string;
  /** Optional right-rail toolbar (filters, primary action). */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({
  user,
  navigation,
  unreadNotifications,
  pageTitle,
  pageDescription,
  toolbar,
  children,
}: DashboardLayoutProps) {
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-fg/30 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar brandName={theme.brandName} items={navigation} variant="expanded" />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar brandName={theme.brandName} items={navigation} variant={theme.sidebar} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-surface/80 px-3 py-2 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
          <span className="font-display text-sm font-semibold">{theme.brandName}</span>
        </div>

        <Header
          user={user}
          unreadNotifications={unreadNotifications}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {(pageTitle || toolbar) && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:hidden">
              {pageTitle && (
                <div>
                  <h1 className="font-display text-xl font-semibold tracking-tight">{pageTitle}</h1>
                  {pageDescription && <p className="text-sm text-fg-muted">{pageDescription}</p>}
                </div>
              )}
            </div>
          )}
          {(pageTitle || toolbar) && (
            <div className="mb-6 hidden flex-wrap items-end justify-between gap-3 md:flex">
              {pageTitle && (
                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight">{pageTitle}</h1>
                  {pageDescription && <p className="text-sm text-fg-muted">{pageDescription}</p>}
                </div>
              )}
              {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
