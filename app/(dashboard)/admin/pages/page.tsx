import type { Metadata } from 'next';
import { pageRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { PagesIndexClient } from './PagesIndexClient';

export const metadata: Metadata = { title: 'Pages' };

export default async function PagesIndexPage() {
  await requireRole(['admin', 'editor']);
  const pages = await pageRepo.list({ sort: { field: 'updatedAt', dir: 'desc' } });
  return <PagesIndexClient initial={pages} />;
}
