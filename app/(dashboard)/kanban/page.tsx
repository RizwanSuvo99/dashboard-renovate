import type { Metadata } from 'next';
import { taskRepo } from '@/lib/repositories';
import { KanbanClient } from './KanbanClient';

export const metadata: Metadata = { title: 'Kanban' };

export default async function KanbanPage() {
  const tasks = await taskRepo.list();
  return <KanbanClient initial={tasks} />;
}
