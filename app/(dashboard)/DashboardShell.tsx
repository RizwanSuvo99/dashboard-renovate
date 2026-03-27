'use client';
import * as React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import type { NavItem } from '@/types';

/**
 * Client wrapper around DashboardLayout because the layout uses Zustand
 * (theme store) and other client-only hooks. The server layout fetches
 * the data and passes it down.
 */
export function DashboardShell({
  user,
  navigation,
  unreadNotifications,
  children,
}: {
  user: { id: string; name: string; email: string; role: string; avatarUrl?: string | null };
  navigation: NavItem[];
  unreadNotifications: number;
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      user={user}
      navigation={navigation}
      unreadNotifications={unreadNotifications}
    >
      {children}
    </DashboardLayout>
  );
}
