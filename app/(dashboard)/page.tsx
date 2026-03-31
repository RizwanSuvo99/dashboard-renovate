import { ArrowRight, DollarSign, ShoppingBag, TrendingUp, UserPlus, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { customerRepo, invoiceRepo, orderRepo, activityRepo, productRepo } from '@/lib/repositories';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { StatCard } from '@/components/molecules/StatCard';
import { ChartCard } from '@/components/organisms/ChartCard';
import { RevenueChart } from '@/components/organisms/charts/RevenueChart';
import { MiniSparkline } from '@/components/organisms/charts/MiniSparkline';
import { ActivityTimeline } from '@/components/organisms/ActivityTimeline';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { formatCompact, formatCurrency, formatRelative } from '@/lib/utils/format';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Overview' };

function monthLabel(offset: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return d.toLocaleDateString('en-US', { month: 'short' });
}

export default async function OverviewPage() {
  const [customers, invoices, orders, activity, products] = await Promise.all([
    customerRepo.list(),
    invoiceRepo.list(),
    orderRepo.list({ sort: { field: 'createdAt', dir: 'desc' } }),
    activityRepo.list({ sort: { field: 'createdAt', dir: 'desc' }, pageSize: 6 }),
    productRepo.list(),
  ]);

  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const mrr = customers.reduce((sum, c) => sum + c.mrr, 0);
  const newCustomers30d = customers.filter(
    (c) => Date.now() - new Date(c.joinedAt).getTime() < 30 * 24 * 3600_000,
  ).length;
  const ordersOpen = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const lowStock = products.filter((p) => p.status !== 'in_stock').length;

  // Build a 12-month revenue series from invoices.
  const revenue = Array.from({ length: 12 })
    .map((_, i) => {
      const offset = 11 - i;
      const dStart = new Date();
      dStart.setMonth(dStart.getMonth() - offset, 1);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(dStart);
      dEnd.setMonth(dEnd.getMonth() + 1);
      const value = invoices
        .filter(
          (inv) =>
            inv.status !== 'void' &&
            new Date(inv.issuedAt) >= dStart &&
            new Date(inv.issuedAt) < dEnd,
        )
        .reduce((sum, inv) => sum + inv.amount, 0);
      const prev = Math.max(0, value * (0.6 + Math.random() * 0.4) - 200);
      return { label: monthLabel(offset), value: Math.round(value), prev: Math.round(prev) };
    });

  const recentOrders = orders.slice(0, 6);
  const timeline = activity.map((a) => ({
    id: a.id,
    who: { name: a.userName },
    action: a.action.replace(/_/g, ' '),
    target: a.target,
    at: a.createdAt,
    tone: 'primary' as const,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-fg-muted">Here is a snapshot of how the business is doing today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/reports">
              View reports
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button size="sm" asChild leftIcon={<Plus size={14} />}>
            <Link href="/customers">New customer</Link>
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly recurring"
          value={formatCurrency(mrr)}
          delta={8.4}
          caption="vs last month"
          icon={<DollarSign size={16} />}
          trail={
            <MiniSparkline data={revenue.slice(-8).map((r) => r.value || 1)} tone="primary" />
          }
        />
        <StatCard
          label="Active customers"
          value={activeCustomers}
          delta={3.1}
          caption={`${newCustomers30d} new this month`}
          icon={<Users size={16} />}
          trail={<MiniSparkline data={[8, 9, 10, 11, 9, 12, 14, 16, 18]} tone="accent" />}
        />
        <StatCard
          label="Open orders"
          value={ordersOpen}
          delta={-2.6}
          caption="awaiting fulfillment"
          icon={<ShoppingBag size={16} />}
          trail={<MiniSparkline data={[12, 14, 11, 13, 10, 9, 11, 8]} tone="success" />}
        />
        <StatCard
          label="Low / out of stock"
          value={lowStock}
          delta={lowStock ? 1.2 : -1}
          caption="check inventory"
          icon={<TrendingUp size={16} />}
          trail={<MiniSparkline data={[3, 4, 3, 5, 6, 4, 5, 7]} tone="danger" />}
        />
      </div>

      {/* Revenue + activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Revenue"
          description="Monthly invoice revenue, last 12 months"
          height={300}
          toolbar={
            <div className="flex gap-1.5 text-xs text-fg-muted">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-sm bg-primary" /> This year
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-sm bg-accent" /> Last year
              </span>
            </div>
          }
        >
          <RevenueChart data={revenue} />
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <Link href="/admin/activity" className="text-xs font-medium text-primary hover:underline">
              All activity →
            </Link>
          </CardHeader>
          <CardBody>
            {timeline.length === 0 ? (
              <p className="text-sm text-fg-muted">No activity yet.</p>
            ) : (
              <ActivityTimeline items={timeline} />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent orders + Quick actions */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <Link href="/orders" className="text-xs font-medium text-primary hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-2/40 text-2xs uppercase tracking-wide text-fg-subtle">
                <tr>
                  <th className="px-5 py-2.5 text-left font-medium">Order</th>
                  <th className="px-5 py-2.5 text-left font-medium">Customer</th>
                  <th className="px-5 py-2.5 text-left font-medium">Status</th>
                  <th className="px-5 py-2.5 text-right font-medium">Total</th>
                  <th className="px-5 py-2.5 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-surface-2/40">
                    <td className="px-5 py-3 font-medium text-fg">{o.reference}</td>
                    <td className="px-5 py-3 text-fg-muted">{o.customerName}</td>
                    <td className="px-5 py-3">
                      <OrderBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-fg">{formatCurrency(o.total)}</td>
                    <td className="px-5 py-3 text-right text-fg-subtle">{formatRelative(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <ActionLink href="/customers" icon={<UserPlus size={14} />} label="Add customer" hint="CRM" />
            <ActionLink href="/products" icon={<ShoppingBag size={14} />} label="New product" hint="Inventory" />
            <ActionLink href="/admin/pages" icon={<Plus size={14} />} label="Build a page" hint="Admin" />
            <ActionLink href="/admin/theme" icon={<TrendingUp size={14} />} label="Customize theme" hint="Admin" />
            <div className="mt-3 rounded-lg border border-dashed border-border bg-surface-2/40 p-3 text-xs text-fg-muted">
              <p className="font-medium text-fg">Tip</p>
              Open the theme customizer to switch palette, radius, and sidebar style — changes apply
              instantly across every page.
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Highlight
          label="MRR"
          value={formatCurrency(mrr)}
          caption={`${formatCompact(activeCustomers)} active customers`}
        />
        <Highlight
          label="Outstanding"
          value={formatCurrency(invoices.filter((i) => i.status !== 'paid' && i.status !== 'void').reduce((s, i) => s + i.amount, 0))}
          caption={`${invoices.filter((i) => i.status === 'overdue').length} overdue`}
        />
        <Highlight
          label="Avg. order value"
          value={formatCurrency(orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0)}
          caption={`${orders.length} orders this period`}
        />
      </div>
    </div>
  );
}

function ActionLink({ href, icon, label, hint }: { href: string; icon: React.ReactNode; label: string; hint?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-sm transition-colors hover:bg-surface-2"
    >
      <span className="grid h-7 w-7 place-items-center rounded bg-primary-soft text-primary">{icon}</span>
      <span className="flex-1 font-medium text-fg">{label}</span>
      {hint && <span className="text-2xs text-fg-subtle">{hint}</span>}
      <ArrowRight size={12} className="text-fg-subtle" />
    </Link>
  );
}

function Highlight({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs uppercase tracking-wide text-fg-subtle">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg">{value}</p>
        <p className="text-xs text-fg-muted">{caption}</p>
      </CardBody>
    </Card>
  );
}

function OrderBadge({ status }: { status: string }) {
  const map: Record<string, Parameters<typeof Badge>[0]['tone']> = {
    new: 'info',
    processing: 'warning',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };
  return (
    <Badge tone={map[status] ?? 'neutral'} dot size="sm">
      {status}
    </Badge>
  );
}
