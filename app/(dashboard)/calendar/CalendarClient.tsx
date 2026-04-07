'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { cn } from '@/lib/utils/cn';

const tones: Record<CalendarEvent['category'], Parameters<typeof Badge>[0]['tone']> = {
  meeting: 'primary',
  release: 'accent',
  review: 'info',
  personal: 'neutral',
};

export function CalendarClient({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month');
  const [cursor, setCursor] = React.useState(() => new Date());

  const monthMatrix = React.useMemo(() => buildMonthMatrix(cursor), [cursor]);
  const monthLabel = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = new Date(e.startsAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-fg-muted">{events.length} events scheduled</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
              { value: 'day', label: 'Day' },
            ]}
          />
          <Button size="sm" leftIcon={<Plus size={14} />}>New event</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Previous month" onClick={() => setCursor((d) => addMonths(d, -1))}>
              <ChevronLeft size={14} />
            </Button>
            <CardTitle className="min-w-[12rem] text-center">{monthLabel}</CardTitle>
            <Button size="icon" variant="ghost" aria-label="Next month" onClick={() => setCursor((d) => addMonths(d, 1))}>
              <ChevronRight size={14} />
            </Button>
          </div>
          <Button size="xs" variant="outline" onClick={() => setCursor(new Date())}>Today</Button>
        </CardHeader>
        <CardBody className="p-0">
          {view === 'month' && (
            <div className="grid grid-cols-7 border-t border-border">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="border-b border-border bg-surface-2/40 px-2 py-1.5 text-2xs font-medium uppercase tracking-wide text-fg-subtle">
                  {d}
                </div>
              ))}
              {monthMatrix.map((day) => {
                const key = day.toDateString();
                const list = eventsByDay.get(key) ?? [];
                const inMonth = day.getMonth() === cursor.getMonth();
                const isToday = key === new Date().toDateString();
                return (
                  <div
                    key={key}
                    className={cn(
                      'min-h-[110px] border-b border-r border-border/70 p-2',
                      !inMonth && 'bg-surface-2/30 text-fg-subtle',
                      isToday && 'ring-1 ring-inset ring-primary',
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className={cn('font-medium', isToday && 'text-primary')}>{day.getDate()}</span>
                      {list.length > 0 && <span className="text-2xs text-fg-subtle">{list.length}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      {list.slice(0, 3).map((e) => (
                        <button
                          key={e.id}
                          className="truncate rounded px-1.5 py-0.5 text-left text-2xs"
                          style={{
                            background: `hsl(var(--${e.category === 'meeting' ? 'primary' : e.category === 'release' ? 'accent' : e.category === 'review' ? 'info' : 'fg-muted'}) / 0.1)`,
                            color: `hsl(var(--${e.category === 'meeting' ? 'primary' : e.category === 'release' ? 'accent' : e.category === 'review' ? 'info' : 'fg-muted'}))`,
                          }}
                        >
                          <span className="font-medium">{new Date(e.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>{' '}
                          {e.title}
                        </button>
                      ))}
                      {list.length > 3 && <p className="text-2xs text-fg-subtle">+{list.length - 3} more</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {view === 'week' && <WeekView events={events} cursor={cursor} />}
          {view === 'day' && <DayView events={events} cursor={cursor} />}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2">
            {events
              .filter((e) => new Date(e.startsAt) >= new Date())
              .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
              .slice(0, 6)
              .map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2">
                  <div className="text-center w-12">
                    <p className="text-2xs uppercase text-fg-subtle">{new Date(e.startsAt).toLocaleString('en-US', { month: 'short' })}</p>
                    <p className="text-md font-display font-semibold">{new Date(e.startsAt).getDate()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">{e.title}</p>
                    <p className="text-xs text-fg-muted">{new Date(e.startsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })} · {e.location ?? 'No location'}</p>
                  </div>
                  <Badge tone={tones[e.category]} size="sm" className="capitalize">{e.category}</Badge>
                </li>
              ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

function addMonths(d: Date, m: number): Date {
  const next = new Date(d);
  next.setMonth(next.getMonth() + m);
  return next;
}

function buildMonthMatrix(cursor: Date): Date[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const dow = (first.getDay() + 6) % 7; // 0 = Mon
  const start = new Date(first);
  start.setDate(start.getDate() - dow);
  return Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function WeekView({ events, cursor }: { events: CalendarEvent[]; cursor: Date }) {
  const start = new Date(cursor);
  const dow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  return (
    <div className="grid grid-cols-7">
      {days.map((d) => {
        const list = events.filter((e) => new Date(e.startsAt).toDateString() === d.toDateString());
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <div key={d.toDateString()} className={cn('min-h-[260px] border-r border-t border-border p-2', isToday && 'bg-primary-soft/30')}>
            <p className="mb-1 text-xs font-medium text-fg-muted">
              {d.toLocaleString('en-US', { weekday: 'short', day: 'numeric' })}
            </p>
            <div className="flex flex-col gap-1.5">
              {list.map((e) => (
                <div key={e.id} className="rounded border border-border bg-surface px-2 py-1 text-xs">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-2xs text-fg-subtle">
                    {new Date(e.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({ events, cursor }: { events: CalendarEvent[]; cursor: Date }) {
  const list = events
    .filter((e) => new Date(e.startsAt).toDateString() === cursor.toDateString())
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  return (
    <div className="border-t border-border">
      <div className="grid grid-cols-[64px_1fr]">
        {Array.from({ length: 12 }).map((_, i) => {
          const hour = i + 8;
          return (
            <React.Fragment key={hour}>
              <div className="border-b border-r border-border px-2 py-3 text-2xs text-fg-subtle">
                {hour}:00
              </div>
              <div className="relative h-12 border-b border-border">
                {list
                  .filter((e) => new Date(e.startsAt).getHours() === hour)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="absolute left-2 right-2 rounded border border-primary/30 bg-primary-soft px-2 py-1 text-xs"
                    >
                      <p className="font-medium text-fg">{e.title}</p>
                      <p className="text-2xs text-fg-muted">
                        {new Date(e.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
