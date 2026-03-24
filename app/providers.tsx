'use client';
import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/molecules/Tooltip';
import { ThemeHydrator } from '@/hooks/useTheme';
import type { ThemeConfig } from '@/design-system/theme';
import '@/widgets/builtins'; // populates the widget registry on import
import '../plugins/example-counter-widget'; // example 3rd-party widget plugin

export function Providers({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: ThemeConfig;
}) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
      }),
  );
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <TooltipProvider>
          <ThemeHydrator initialTheme={initialTheme} />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
