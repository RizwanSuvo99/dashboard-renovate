import type { Metadata } from 'next';
import { eventRepo } from '@/lib/repositories';
import { CalendarClient } from './CalendarClient';

export const metadata: Metadata = { title: 'Calendar' };

export default async function CalendarPage() {
  const events = await eventRepo.list();
  return <CalendarClient events={events} />;
}
