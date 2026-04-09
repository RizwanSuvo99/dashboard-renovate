'use client';
import * as React from 'react';
import { Archive, Inbox, Mail, Send, Star, Trash2, Edit3, Reply } from 'lucide-react';
import type { MessageThread } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input, Textarea } from '@/components/atoms/Input';
import { Card } from '@/components/molecules/Card';
import { EmptyState } from '@/components/molecules/EmptyState';
import { formatRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const FOLDERS = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'drafts', label: 'Drafts', icon: Edit3 },
  { key: 'archive', label: 'Archive', icon: Archive },
] as const;

export function MessagesClient({ threads }: { threads: MessageThread[] }) {
  const [folder, setFolder] = React.useState<(typeof FOLDERS)[number]['key']>('inbox');
  const [activeId, setActiveId] = React.useState<string | null>(threads[0]?.id ?? null);

  const filtered = threads.filter((t) => t.folder === folder);
  const active = filtered.find((t) => t.id === activeId) ?? filtered[0] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-fg-muted">Inbox-style conversations with your customers and team</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid h-[640px] grid-cols-1 md:grid-cols-[200px_320px_1fr]">
          {/* Folders */}
          <aside className="hidden border-r border-border bg-surface-2/40 p-3 md:block">
            <Button size="sm" block leftIcon={<Edit3 size={14} />}>Compose</Button>
            <ul className="mt-3 flex flex-col gap-0.5">
              {FOLDERS.map(({ key, label, icon: Icon }) => {
                const active = folder === key;
                const count = threads.filter((t) => t.folder === key).length;
                return (
                  <li key={key}>
                    <button
                      onClick={() => {
                        setFolder(key);
                        setActiveId(null);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors',
                        active ? 'bg-primary-soft text-fg font-medium' : 'text-fg-muted hover:bg-surface',
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon size={14} className={active ? 'text-primary' : 'text-fg-subtle'} /> {label}
                      </span>
                      <span className="text-2xs text-fg-subtle">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Thread list */}
          <div className="flex flex-col border-r border-border">
            <div className="border-b border-border p-3">
              <Input placeholder="Search messages…" />
            </div>
            <ul className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Mail size={20} />}
                  title="Nothing here"
                  description={`No messages in ${folder}.`}
                  size="sm"
                />
              ) : (
                filtered.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setActiveId(t.id)}
                      className={cn(
                        'flex w-full flex-col gap-1 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-surface-2',
                        active?.id === t.id && 'bg-surface-2',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={t.participants[1] ?? 'Unknown'} size="xs" />
                        <span className={cn('truncate text-sm', t.unread ? 'font-semibold text-fg' : 'text-fg-muted')}>
                          {t.participants[1] ?? 'Unknown'}
                        </span>
                        {t.starred && <Star size={12} className="text-warning" fill="currentColor" />}
                        <span className="ml-auto text-2xs text-fg-subtle">{formatRelative(t.lastMessageAt)}</span>
                      </div>
                      <p className={cn('truncate text-sm', t.unread ? 'font-medium text-fg' : 'text-fg-muted')}>
                        {t.subject}
                      </p>
                      <p className="truncate text-xs text-fg-subtle">{t.preview}</p>
                      {t.unread && (
                        <Badge tone="primary" size="sm" className="self-start">New</Badge>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Thread view */}
          <div className="flex flex-col">
            {active ? (
              <>
                <header className="flex items-center gap-3 border-b border-border px-5 py-3">
                  <Avatar name={active.participants[1] ?? 'Unknown'} />
                  <div className="flex-1">
                    <p className="font-medium text-fg">{active.subject}</p>
                    <p className="text-xs text-fg-subtle">{active.participants.join(', ')}</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Star"><Star size={14} /></Button>
                  <Button size="icon" variant="ghost" aria-label="Archive"><Archive size={14} /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete"><Trash2 size={14} /></Button>
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  <article className="rounded-md border border-border bg-surface px-4 py-3">
                    <header className="mb-2 flex items-center gap-2 text-xs text-fg-muted">
                      <Avatar name={active.participants[1] ?? 'Unknown'} size="xs" />
                      <span className="font-medium text-fg">{active.participants[1] ?? 'Unknown'}</span>
                      <span>·</span>
                      <span>{formatRelative(active.lastMessageAt)}</span>
                    </header>
                    <p className="text-sm leading-relaxed text-fg">{active.preview}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg">
                      Following up on the earlier thread — happy to walk through this together. Let me know what time works for you in the next couple of days.
                    </p>
                  </article>
                </div>

                <footer className="border-t border-border p-4">
                  <Textarea placeholder="Write a reply…" rows={3} />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Save draft</Button>
                    <Button size="sm" leftIcon={<Reply size={14} />}>Reply</Button>
                  </div>
                </footer>
              </>
            ) : (
              <EmptyState
                icon={<Mail size={20} />}
                title="No conversation selected"
                description="Pick a thread from the list to read."
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
