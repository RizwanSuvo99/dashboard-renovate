'use client';
import * as React from 'react';
import { Bell, Check, Filter } from 'lucide-react';
import type { Notification } from '@/types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card, CardBody } from '@/components/molecules/Card';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { EmptyState } from '@/components/molecules/EmptyState';
import { formatRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const tones: Record<Notification['type'], Parameters<typeof Badge>[0]['tone']> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

export function NotificationsClient({ initial }: { initial: Notification[] }) {
  const [items, setItems] = React.useState(initial);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const visible = filter === 'unread' ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((arr) => arr.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-fg-muted">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
            ]}
          />
          <Button size="sm" variant="outline" onClick={markAllRead} leftIcon={<Check size={14} />}>
            Mark all read
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          {visible.length === 0 ? (
            <EmptyState
              icon={<Bell size={20} />}
              title={filter === 'unread' ? "You're all caught up" : 'No notifications yet'}
              description="When something needs your attention, it will appear here."
              action={filter === 'unread' && unreadCount === 0 ? <Button size="sm" variant="ghost" onClick={() => setFilter('all')} leftIcon={<Filter size={14} />}>Show all</Button> : undefined}
            />
          ) : (
            <ul>
              {visible.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 border-b border-border/60 px-5 py-3 last:border-0',
                    !n.read && 'bg-primary-soft/30',
                  )}
                >
                  <span className={cn('mt-1 inline-block h-2 w-2 rounded-full', !n.read ? 'bg-primary' : 'bg-fg-subtle/40')} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={tones[n.type]} size="sm" dot>{n.type}</Badge>
                      <p className="text-sm font-medium text-fg">{n.title}</p>
                      <span className="ml-auto text-2xs text-fg-subtle">{formatRelative(n.createdAt)}</span>
                    </div>
                    {n.body && <p className="mt-1 text-sm text-fg-muted">{n.body}</p>}
                  </div>
                  {!n.read && (
                    <Button size="xs" variant="ghost" onClick={() => markRead(n.id)} aria-label="Mark read">
                      <Check size={14} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
