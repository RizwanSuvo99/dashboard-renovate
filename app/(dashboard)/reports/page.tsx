import type { Metadata } from 'next';
import { customerRepo, invoiceRepo, orderRepo } from '@/lib/repositories';
import { ReportsClient } from './ReportsClient';

export const metadata: Metadata = { title: 'Reports' };

export default async function ReportsPage() {
  const [customers, invoices, orders] = await Promise.all([
    customerRepo.list(),
    invoiceRepo.list(),
    orderRepo.list(),
  ]);
  return <ReportsClient customers={customers} invoices={invoices} orders={orders} />;
}
