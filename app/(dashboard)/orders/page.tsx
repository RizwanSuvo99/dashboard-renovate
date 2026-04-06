import type { Metadata } from 'next';
import { orderRepo } from '@/lib/repositories';
import { OrdersClient } from './OrdersClient';

export const metadata: Metadata = { title: 'Orders' };

export default async function OrdersPage() {
  const orders = await orderRepo.list({ sort: { field: 'createdAt', dir: 'desc' } });
  return <OrdersClient initial={orders} />;
}
