'use client';
import * as React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Eye, Receipt } from 'lucide-react';
import type { Invoice } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Drawer } from '@/components/organisms/Drawer';
import { DataTable } from '@/components/organisms/DataTable';
import { formatCurrency, formatRelative } from '@/lib/utils/format';

const helper = createColumnHelper<Invoice>();

const statusTone = (s: Invoice['status']): Parameters<typeof Badge>[0]['tone'] =>
  s === 'paid' ? 'success'
  : s === 'open' ? 'info'
  : s === 'overdue' ? 'danger'
  : 'neutral';

export function InvoicesClient({ initial }: { initial: Invoice[] }) {
  const [selected, setSelected] = React.useState<Invoice | null>(null);

  const columns = React.useMemo(
    () => [
      helper.accessor('number', { header: 'Number', cell: ({ getValue }) => <span className="font-mono text-fg">{getValue()}</span> }),
      helper.accessor('customerName', {
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.original.customerName} size="xs" />
            <span>{row.original.customerName}</span>
          </div>
        ),
      }),
      helper.accessor('amount', {
        header: 'Amount',
        cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
      }),
      helper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <Badge tone={statusTone(getValue())} dot size="sm" className="capitalize">{getValue()}</Badge>,
      }),
      helper.accessor('issuedAt', {
        header: 'Issued',
        cell: ({ getValue }) => <span className="text-fg-subtle">{formatRelative(getValue())}</span>,
      }),
      helper.accessor('dueAt', {
        header: 'Due',
        cell: ({ getValue }) => <span className="text-fg-subtle">{formatRelative(getValue())}</span>,
      }),
    ],
    [],
  );

  const totals = React.useMemo(() => ({
    paid: initial.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    open: initial.filter((i) => i.status === 'open').reduce((s, i) => s + i.amount, 0),
    overdue: initial.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  }), [initial]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-fg-muted">{initial.length} invoices · {formatCurrency(totals.paid)} collected</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" leftIcon={<Download size={14} />}>Export</Button>
          <Button size="sm" leftIcon={<Receipt size={14} />}>New invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Paid', value: totals.paid, tone: 'success' as const },
          { label: 'Open', value: totals.open, tone: 'info' as const },
          { label: 'Overdue', value: totals.overdue, tone: 'danger' as const },
        ].map((r) => (
          <div key={r.label} className="surface flex items-center gap-3 px-5 py-4">
            <Badge tone={r.tone} dot size="sm">{r.label}</Badge>
            <div className="ml-auto text-right">
              <p className="font-display text-lg font-semibold tracking-tight">{formatCurrency(r.value)}</p>
              <p className="text-xs text-fg-subtle">{initial.filter((i) => i.status === r.label.toLowerCase()).length} invoices</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable<Invoice>
        columns={columns}
        data={initial}
        searchableFields={['number', 'customerName']}
        onRowClick={setSelected}
        pageSize={15}
        emptyTitle="No invoices yet"
        emptyIcon={<Receipt size={20} />}
      />

      <Drawer
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected?.number}
        description={selected?.customerName}
        width="lg"
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button size="sm" variant="outline" leftIcon={<Eye size={14} />}>View PDF</Button>
            <Button size="sm" leftIcon={<Download size={14} />}>Download</Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="text-2xs uppercase tracking-wide text-fg-subtle">Total</p>
              <p className="font-display text-2xl font-semibold tracking-tight text-fg">{formatCurrency(selected.amount)}</p>
              <p className="mt-1 text-xs text-fg-muted">
                Issued {formatRelative(selected.issuedAt)} · Due {formatRelative(selected.dueAt)}
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-surface-2/30 p-8 text-center text-sm text-fg-subtle">
              <Receipt size={32} className="mx-auto mb-2 text-fg-subtle" />
              <p className="font-medium text-fg">PDF preview placeholder</p>
              <p className="mt-1 text-xs">
                Wire up your PDF generator (e.g. <code className="font-mono">react-pdf</code> or a Lambda) to render here.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
