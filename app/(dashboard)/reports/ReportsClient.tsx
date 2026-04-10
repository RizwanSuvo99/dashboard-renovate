'use client';
import * as React from 'react';
import { Download, Printer } from 'lucide-react';
import type { Customer, Invoice, Order } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { ChartCard } from '@/components/organisms/ChartCard';
import { RevenueChart } from '@/components/organisms/charts/RevenueChart';
import { formatCurrency } from '@/lib/utils/format';

export function ReportsClient({
  customers,
  invoices,
  orders,
}: {
  customers: Customer[];
  invoices: Invoice[];
  orders: Order[];
}) {
  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const arr = customers.reduce((s, c) => s + c.mrr * 12, 0);
  const aov = orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

  const byMonth = React.useMemo(() => {
    const result: { label: string; value: number; prev: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i, 1);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setMonth(next.getMonth() + 1);
      const value = invoices
        .filter((inv) => inv.status === 'paid' && new Date(inv.issuedAt) >= d && new Date(inv.issuedAt) < next)
        .reduce((s, inv) => s + inv.amount, 0);
      result.push({ label: d.toLocaleString('en-US', { month: 'short' }), value, prev: Math.round(value * 0.7) });
    }
    return result;
  }, [invoices]);

  const exportCsv = () => {
    const rows = [
      ['Number', 'Customer', 'Amount', 'Status', 'Issued', 'Due'],
      ...invoices.map((i) => [i.number, i.customerName, i.amount, i.status, i.issuedAt, i.dueAt]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3 no-print">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-fg-muted">Quarterly business overview</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" leftIcon={<Printer size={14} />} onClick={() => window.print()}>
            Print
          </Button>
          <Button size="sm" leftIcon={<Download size={14} />} onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KPI label="Total revenue (paid)" value={formatCurrency(totalRevenue)} />
            <KPI label="Annualized recurring" value={formatCurrency(arr)} />
            <KPI label="Average order value" value={formatCurrency(aov)} />
          </div>
        </CardBody>
      </Card>

      <ChartCard title="Revenue by month" description="Last 12 months — paid invoices" height={320}>
        <RevenueChart data={byMonth} />
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Invoice ledger</CardTitle>
          <Badge tone="neutral" size="sm">{invoices.length} rows</Badge>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-2/50 text-2xs uppercase tracking-wide text-fg-subtle">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Number</th>
                  <th className="px-4 py-2 text-left font-medium">Customer</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Issued</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 20).map((i) => (
                  <tr key={i.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2 font-mono text-fg">{i.number}</td>
                    <td className="px-4 py-2">{i.customerName}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(i.amount)}</td>
                    <td className="px-4 py-2 capitalize">{i.status}</td>
                    <td className="px-4 py-2 text-fg-subtle">{new Date(i.issuedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xs uppercase tracking-wide text-fg-subtle">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg">{value}</p>
    </div>
  );
}
