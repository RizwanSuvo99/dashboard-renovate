import type { Metadata } from 'next';
import { customerRepo, invoiceRepo, orderRepo, productRepo } from '@/lib/repositories';
import { AnalyticsClient } from './AnalyticsClient';

export const metadata: Metadata = { title: 'Analytics' };

export default async function AnalyticsPage() {
  const [customers, invoices, orders, products] = await Promise.all([
    customerRepo.list(),
    invoiceRepo.list(),
    orderRepo.list(),
    productRepo.list(),
  ]);

  // Build series.
  const monthLabels: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    monthLabels.push(d.toLocaleString('en-US', { month: 'short' }));
  }

  const revenueSeries = monthLabels.map((label, i) => {
    const offset = 11 - i;
    const dStart = new Date();
    dStart.setMonth(dStart.getMonth() - offset, 1);
    dStart.setHours(0, 0, 0, 0);
    const dEnd = new Date(dStart);
    dEnd.setMonth(dEnd.getMonth() + 1);
    const value = invoices
      .filter((inv) => inv.status !== 'void' && new Date(inv.issuedAt) >= dStart && new Date(inv.issuedAt) < dEnd)
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { label, value: Math.round(value), prev: Math.round(value * 0.7 + 200) };
  });

  const planBreakdown = ['free', 'pro', 'enterprise'].map((plan) => ({
    name: plan,
    value: customers.filter((c) => c.plan === plan).length,
  }));

  const ordersByStatus = ['new', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => ({
    label: s,
    value: orders.filter((o) => o.status === s).length,
  }));

  const topProducts = products
    .slice()
    .sort((a, b) => b.price * (50 - b.stock) - a.price * (50 - a.stock))
    .slice(0, 6)
    .map((p) => ({ name: p.name, sales: Math.round(p.price * (50 - Math.min(p.stock, 50))) }));

  return (
    <AnalyticsClient
      revenue={revenueSeries}
      planBreakdown={planBreakdown}
      ordersByStatus={ordersByStatus}
      topProducts={topProducts}
    />
  );
}
