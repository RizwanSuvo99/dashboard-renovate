import type { Metadata } from 'next';
import { navigationRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { NavigationBuilderClient } from './NavigationBuilderClient';

export const metadata: Metadata = { title: 'Navigation' };

export default async function NavigationBuilderPage() {
  await requireRole('admin');
  const items = await navigationRepo.list();
  return <NavigationBuilderClient initial={items} />;
}
