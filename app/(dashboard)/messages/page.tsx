import type { Metadata } from 'next';
import { threadRepo } from '@/lib/repositories';
import { MessagesClient } from './MessagesClient';

export const metadata: Metadata = { title: 'Messages' };

export default async function MessagesPage() {
  const threads = await threadRepo.list({ sort: { field: 'lastMessageAt', dir: 'desc' } });
  return <MessagesClient threads={threads} />;
}
