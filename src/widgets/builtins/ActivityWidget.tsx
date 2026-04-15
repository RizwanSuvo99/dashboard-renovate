'use client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { ActivityTimeline } from '@/components/organisms/ActivityTimeline';
import { Spinner } from '@/components/atoms/Spinner';
import type { ActivityEntry } from '@/types';

export function ActivityWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { title?: string; limit?: number };
  const { data, isLoading } = useQuery({
    queryKey: ['widget-activity', c.limit ?? 6],
    queryFn: async () => {
      const res = await fetch('/api/activity');
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as ActivityEntry[];
    },
  });
  return (
    <Card>
      <CardHeader><CardTitle>{c.title ?? 'Recent activity'}</CardTitle></CardHeader>
      <CardBody>
        {isLoading && <Spinner />}
        {data && (
          <ActivityTimeline
            items={data.slice(0, c.limit ?? 6).map((a) => ({
              id: a.id,
              who: { name: a.userName },
              action: a.action.replace(/_/g, ' '),
              target: a.target,
              at: a.createdAt,
              tone: 'primary' as const,
            }))}
          />
        )}
      </CardBody>
    </Card>
  );
}
