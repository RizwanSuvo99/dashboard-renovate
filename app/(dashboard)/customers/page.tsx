import type { Metadata } from 'next';
import { customerRepo } from '@/lib/repositories';
import { CustomersClient } from './CustomersClient';

export const metadata: Metadata = { title: 'Customers' };

export default async function CustomersPage() {
  const customers = await customerRepo.list({ sort: { field: 'joinedAt', dir: 'desc' } });
  return <CustomersClient initial={customers} />;
}
