'use client';
import * as React from 'react';
import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Mail, Plus, Trash2, UserCircle, UserX } from 'lucide-react';
import type { Customer } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { Drawer } from '@/components/organisms/Drawer';
import { ActivityTimeline } from '@/components/organisms/ActivityTimeline';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { formatCurrency, formatRelative } from '@/lib/utils/format';

const helper = createColumnHelper<Customer>();

const planTone = (plan: Customer['plan']): Parameters<typeof Badge>[0]['tone'] =>
  plan === 'enterprise' ? 'primary' : plan === 'pro' ? 'accent' : 'neutral';

const statusTone = (status: Customer['status']): Parameters<typeof Badge>[0]['tone'] =>
  status === 'active' ? 'success'
  : status === 'pending' ? 'warning'
  : status === 'churned' ? 'danger'
  : 'info';

export function CustomersClient({ initial }: { initial: Customer[] }) {
  const [selected, setSelected] = React.useState<Customer | null>(null);

  const columns = React.useMemo(
    () => [
      helper.accessor('name', {
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.name} src={row.original.avatarUrl ?? undefined} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-fg">{row.original.name}</p>
              <p className="truncate text-xs text-fg-subtle">{row.original.email}</p>
            </div>
          </div>
        ),
      }),
      helper.accessor('company', { header: 'Company' }),
      helper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const v = getValue();
          return <Badge tone={statusTone(v)} dot size="sm" className="capitalize">{v}</Badge>;
        },
      }),
      helper.accessor('plan', {
        header: 'Plan',
        cell: ({ getValue }) => {
          const v = getValue();
          return <Badge tone={planTone(v)} size="sm" className="capitalize">{v}</Badge>;
        },
      }),
      helper.accessor('mrr', {
        header: 'MRR',
        cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
      }),
      helper.accessor('country', { header: 'Country' }),
      helper.accessor('lastActiveAt', {
        header: 'Last active',
        cell: ({ getValue }) => <span className="text-fg-subtle">{formatRelative(getValue() ?? '')}</span>,
      }),
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-fg-muted">{initial.length.toLocaleString()} accounts in your CRM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button size="sm" leftIcon={<Plus size={14} />}>
            New customer
          </Button>
        </div>
      </div>

      <DataTable<Customer>
        columns={columns}
        data={initial}
        searchableFields={['name', 'email', 'company', 'country']}
        onRowClick={setSelected}
        bulkActions={(rows, clear) => (
          <>
            <button className="hover:underline" onClick={clear}>Email</button>
            <span className="text-primary/40">·</span>
            <button className="hover:underline" onClick={clear}>Tag</button>
            <span className="text-primary/40">·</span>
            <button className="hover:underline" onClick={clear}>Delete</button>
          </>
        )}
        pageSize={12}
        emptyTitle="No customers yet"
        emptyDescription="When you onboard a customer, they will show here."
        emptyIcon={<UserX size={20} />}
        emptyAction={
          <Button size="sm" leftIcon={<Plus size={14} />}>Add customer</Button>
        }
      />

      <Drawer
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected?.name}
        description={selected?.company}
        width="lg"
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button size="sm" variant="outline" leftIcon={<Mail size={14} />}>Email</Button>
            <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />}>Delete</Button>
          </>
        }
      >
        {selected && <CustomerDetail customer={selected} />}
      </Drawer>
    </div>
  );
}

function CustomerDetail({ customer }: { customer: Customer }) {
  const stats = [
    { label: 'Plan', value: customer.plan, capital: true },
    { label: 'MRR', value: formatCurrency(customer.mrr) },
    { label: 'Status', value: customer.status, capital: true },
    { label: 'Country', value: customer.country ?? '—' },
  ];

  const fauxTimeline = [
    { id: '1', who: { name: customer.name }, action: 'opened a support ticket', target: 'API limits', at: new Date(Date.now() - 86400_000).toISOString(), tone: 'primary' as const },
    { id: '2', who: { name: 'Mira Park' }, action: 'sent a check-in email', at: new Date(Date.now() - 4 * 86400_000).toISOString(), tone: 'neutral' as const },
    { id: '3', who: { name: customer.name }, action: 'upgraded to', target: customer.plan, at: customer.joinedAt, tone: 'success' as const },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar name={customer.name} src={customer.avatarUrl ?? undefined} size="xl" />
        <div className="flex-1">
          <p className="text-md font-semibold text-fg">{customer.name}</p>
          <p className="text-sm text-fg-muted">{customer.email}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Badge tone={statusTone(customer.status)} dot size="sm" className="capitalize">{customer.status}</Badge>
            <Badge tone={planTone(customer.plan)} size="sm" className="capitalize">{customer.plan}</Badge>
            {customer.tags?.map((t) => <Badge key={t} tone="neutral" size="sm">{t}</Badge>)}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/customers/${customer.id}`}>
            <UserCircle size={14} /> Full profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-surface-2/50 px-3 py-2">
            <p className="text-2xs uppercase tracking-wide text-fg-subtle">{s.label}</p>
            <p className={`mt-0.5 text-sm font-semibold ${s.capital ? 'capitalize' : ''}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardBody>
          <ActivityTimeline items={fauxTimeline} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <Button size="xs" variant="ghost">Add note</Button>
        </CardHeader>
        <CardBody>
          {customer.notes && customer.notes.length > 0 ? (
            <ul className="space-y-3">
              {customer.notes.map((n) => (
                <li key={n.id} className="rounded-md border border-border bg-surface-2/40 p-3 text-sm">
                  <p className="text-fg">{n.body}</p>
                  <p className="mt-1 text-xs text-fg-subtle">{formatRelative(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fg-muted">No notes yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
