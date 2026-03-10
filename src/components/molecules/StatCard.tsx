import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card, CardBody } from './Card';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Trend percentage; sign drives icon and color. */
  delta?: number;
  /** Help text under the delta (e.g. "vs last week"). */
  caption?: string;
  /** Lucide icon component. */
  icon?: React.ReactNode;
  /** Optional sparkline area (Recharts node). */
  trail?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, delta, caption, icon, trail, className }: StatCardProps) {
  const dir = delta === undefined ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const deltaTone =
    dir === 'up' ? 'text-success' : dir === 'down' ? 'text-danger' : 'text-fg-subtle';
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus;
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardBody className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-fg-muted">
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
          {icon && (
            <span className="text-fg-subtle" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
        <div className="font-display text-3xl font-semibold tracking-tight text-fg">{value}</div>
        {(delta !== undefined || caption) && (
          <div className={cn('mt-0.5 flex items-center gap-1 text-xs', deltaTone)}>
            {delta !== undefined && (
              <>
                <Icon size={12} />
                <span className="font-medium">{Math.abs(delta).toFixed(1)}%</span>
              </>
            )}
            {caption && <span className="text-fg-subtle">{caption}</span>}
          </div>
        )}
      </CardBody>
      {trail && <div className="-mb-px h-12 w-full">{trail}</div>}
    </Card>
  );
}
