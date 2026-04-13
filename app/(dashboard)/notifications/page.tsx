import type { Metadata } from 'next';
import { notificationRepo } from '@/lib/repositories';
import { NotificationsClient } from './NotificationsClient';

export const metadata: Metadata = { title: 'Notifications' };

export default async function NotificationsPage() {
  const notifications = await notificationRepo.list({ sort: { field: 'createdAt', dir: 'desc' } });
  return <NotificationsClient initial={notifications} />;
}
