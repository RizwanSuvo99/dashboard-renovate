import type { Metadata } from 'next';
import { activityRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { ActivityLogClient } from './ActivityLogClient';

export const metadata: Metadata = { title: 'Activity log' };

export default async function ActivityLogPage() {
  await requireRole('admin');
  const items = await activityRepo.list({ sort: { field: 'createdAt', dir: 'desc' } });
  return <ActivityLogClient initial={items} />;
}
