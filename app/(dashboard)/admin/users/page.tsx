import type { Metadata } from 'next';
import { userRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { UsersAdminClient } from './UsersAdminClient';

export const metadata: Metadata = { title: 'Users & roles' };

export default async function UsersAdminPage() {
  await requireRole('admin');
  const users = (await userRepo.list({ sort: { field: 'createdAt', dir: 'desc' } }))
    .map(({ passwordHash: _ph, ...rest }) => rest);
  return <UsersAdminClient initial={users} />;
}
