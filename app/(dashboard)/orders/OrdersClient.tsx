'use client';
import * as React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Filter, ListTree, ShoppingBag } from 'lucide-react';
import type { Order } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card, CardBody } from '@/components/molecules/Card';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { DataTable } from '@/components/organisms/DataTable';
import { formatCurrency, formatRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const helper = createColumnHelper<Order>();

const COLUMNS: Array<{ key: Order['status']; label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = [
  { key: 'new', label: 'New', tone: 'info' },
  { key: 'processing', label: 'Processing', tone: 'warning' },
  { key: 'shipped', label: 'Shipped', tone: 'primary' },
  { key: 'delivered', label: 'Delivered', tone: 'success' },
  { key: 'cancelled', label: 'Cancelled', tone: 'danger' },
];

export function OrdersClient({ initial }: { initial: Order[] }) {
  const [view, setView] = React.useState<'pipeline' | 'table'>('pipeline');

  const grouped = React.useMemo(() => {
    const map = new Map<Order['status'], Order[]>();
    for (const c of COLUMNS) map.set(c.key, []);
    for (const o of initial) map.get(o.status)?.push(o);
    return map;
  }, [initial]);

  const columns = React.useMemo(
    () => [
      helper.accessor('reference', {
        header: 'Order',
        cell: ({ getValue }) => <span className="font-medium text-fg">{getValue()}</span>,
      }),
      helper.accessor('customerName', {
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.original.customerName} size="xs" />
            <span>{row.original.customerName}</span>
          </div>
        ),
      }),
      helper.accessor('items', { header: 'Items' }),
      helper.accessor('total', {
        header: 'Total',
        cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
      }),
      helper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const v = getValue();
          const col = COLUMNS.find((c) => c.key === v);
          return <Badge tone={col?.tone ?? 'neutral'} dot size="sm">{col?.label ?? v}</Badge>;
        },
      }),
      helper.accessor('createdAt', {
        header: 'Date',
        cell: ({ getValue }) => <span className="text-fg-subtle">{formatRelative(getValue())}</span>,
      }),
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-fg-muted">{initial.length} orders across the pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: 'pipeline', label: 'Pipeline', icon: <ListTree size={14} /> },
              { value: 'table', label: 'Table', icon: <Filter size={14} /> },
            ]}
          />
          <Button size="sm" leftIcon={<ShoppingBag size={14} />}>Create order</Button>
        </div>
      </div>

      {view === 'pipeline' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const rows = grouped.get(col.key) ?? [];
            const total = rows.reduce((s, o) => s + o.total, 0);
            return (
              <div
                key={col.key}
                className={cn('flex flex-col gap-2 rounded-lg border border-border bg-surface-2/40 p-3')}
              >
                <header className="flex items-center justify-between">
                  <Badge tone={col.tone} size="sm" dot className="capitalize">{col.label}</Badge>
                  <span className="text-2xs font-medium text-fg-subtle">{rows.length}</span>
                </header>
                <p className="text-2xs text-fg-subtle">{formatCurrency(total)} total</p>
                <ul className="flex flex-col gap-2">
                  {rows.slice(0, 6).map((o) => (
                    <li key={o.id} className="rounded-md border border-border bg-surface p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-fg">{o.reference}</p>
                        <p className="text-xs text-fg-muted">{formatCurrency(o.total)}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-fg-subtle">{o.customerName}</p>
                      <p className="text-2xs text-fg-subtle">{formatRelative(o.createdAt)}</p>
                    </li>
                  ))}
                  {rows.length === 0 && (
                    <li className="rounded border border-dashed border-border px-3 py-4 text-center text-xs text-fg-subtle">
                      No orders here.
                    </li>
                  )}
                  {rows.length > 6 && (
                    <li className="text-center text-xs text-fg-muted">+{rows.length - 6} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="p-3">
              <DataTable<Order>
                columns={columns}
                data={initial}
                searchableFields={['reference', 'customerName']}
                pageSize={15}
                emptyTitle="No orders yet"
                emptyDescription="Once orders are placed, they'll show up here."
                emptyIcon={<ShoppingBag size={20} />}
              />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
