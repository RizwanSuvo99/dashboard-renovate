import type { Metadata } from 'next';
import { invoiceRepo } from '@/lib/repositories';
import { InvoicesClient } from './InvoicesClient';

export const metadata: Metadata = { title: 'Invoices' };

export default async function InvoicesPage() {
  const invoices = await invoiceRepo.list({ sort: { field: 'issuedAt', dir: 'desc' } });
  return <InvoicesClient initial={invoices} />;
}
