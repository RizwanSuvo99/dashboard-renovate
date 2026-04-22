'use client';
import * as React from 'react';
import { History } from 'lucide-react';
import type { ActivityEntry } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardBody } from '@/components/molecules/Card';
import { SearchBar } from '@/components/molecules/SearchBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { formatRelative } from '@/lib/utils/format';

const ACTION_TONE: Record<string, Parameters<typeof Badge>[0]['tone']> = {
  created_user: 'success',
  deleted_user: 'danger',
  updated_user: 'info',
  updated_theme: 'primary',
  created_page: 'success',
  updated_page: 'info',
  deleted_page: 'danger',
  updated_navigation: 'primary',
};

export function ActivityLogClient({ initial }: { initial: ActivityEntry[] }) {
  const [filter, setFilter] = React.useState('');

  const visible = filter
    ? initial.filter((i) =>
        [i.action, i.target, i.userName].some((s) => s.toLowerCase().includes(filter.toLowerCase())),
      )
    : initial;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Activity log</h1>
        <p className="text-sm text-fg-muted">Every admin write is captured here.</p>
      </div>
      <SearchBar value={filter} onChange={setFilter} placeholder="Filter by user, action, or target…" />
      <Card>
        <CardBody className="p-0">
          {visible.length === 0 ? (
            <EmptyState icon={<History size={20} />} title="No activity matches that filter" />
          ) : (
            <ul>
              {visible.map((a) => (
                <li key={a.id} className="flex items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                  <Avatar name={a.userName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-fg">{a.userName}</span>{' '}
                      <span className="text-fg-muted">{a.action.replace(/_/g, ' ')}</span>
                    </p>
                    <p className="truncate text-xs text-fg-subtle">{a.target}</p>
                  </div>
                  <Badge tone={ACTION_TONE[a.action] ?? 'neutral'} size="sm" className="capitalize">
                    {a.action.split('_')[0]}
                  </Badge>
                  <span className="text-2xs text-fg-subtle">{formatRelative(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
