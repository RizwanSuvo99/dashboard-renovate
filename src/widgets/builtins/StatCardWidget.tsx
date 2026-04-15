'use client';
import { TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';

export function StatCardWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { label?: string; value?: string; delta?: number; caption?: string };
  return (
    <StatCard
      label={c.label ?? 'Stat'}
      value={c.value ?? '0'}
      delta={c.delta}
      caption={c.caption}
      icon={<TrendingUp size={16} />}
    />
  );
}
