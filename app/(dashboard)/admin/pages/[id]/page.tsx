import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { PageBuilderClient } from './PageBuilderClient';

export const metadata: Metadata = { title: 'Edit page' };

export default async function PageEditPage({ params }: { params: { id: string } }) {
  await requireRole(['admin', 'editor']);
  const page = await pageRepo.findById(params.id);
  if (!page) notFound();
  return <PageBuilderClient page={page} />;
}
