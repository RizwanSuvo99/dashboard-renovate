import * as React from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { formatRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface TimelineItem {
  id: string;
  who: { name: string; avatarUrl?: string | null };
  action: string;
  target?: string;
  at: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function ActivityTimeline({ items, dense }: { items: TimelineItem[]; dense?: boolean }) {
  return (
    <ol className={cn('relative ml-4 border-l border-border', dense ? 'space-y-3' : 'space-y-5')}>
      {items.map((it) => (
        <li key={it.id} className="relative pl-4">
          <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <Avatar name={it.who.name} src={it.who.avatarUrl ?? undefined} size="xs" />
            <span className="font-medium text-fg">{it.who.name}</span>
            <span className="text-fg-muted">{it.action}</span>
            {it.target && (
              <Badge tone={it.tone ?? 'neutral'} size="sm">
                {it.target}
              </Badge>
            )}
            <span className="ml-auto text-2xs text-fg-subtle">{formatRelative(it.at)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
