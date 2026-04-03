import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, DollarSign, Mail, Building2 } from 'lucide-react';
import { customerRepo, orderRepo, invoiceRepo } from '@/lib/repositories';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { ActivityTimeline } from '@/components/organisms/ActivityTimeline';
import { formatCurrency, formatRelative } from '@/lib/utils/format';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const c = await customerRepo.findById(params.id);
  return { title: c ? c.name : 'Customer' };
}

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await customerRepo.findById(params.id);
  if (!customer) notFound();

  const [orders, invoices] = await Promise.all([
    orderRepo.list().then((all) => all.filter((o) => o.customerId === params.id)),
    invoiceRepo.list().then((all) => all.filter((i) => i.customerId === params.id)),
  ]);

  const lifetimeRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);

  const timeline = [
    { id: 't1', who: { name: customer.name }, action: 'joined as', target: customer.plan, at: customer.joinedAt, tone: 'primary' as const },
    ...orders.slice(0, 5).map((o) => ({
      id: `t-o-${o.id}`,
      who: { name: customer.name },
      action: 'placed order',
      target: o.reference,
      at: o.createdAt,
      tone: 'neutral' as const,
    })),
    ...invoices.slice(0, 3).map((i) => ({
      id: `t-i-${i.id}`,
      who: { name: customer.name },
      action: i.status === 'paid' ? 'paid invoice' : 'received invoice',
      target: i.number,
      at: i.issuedAt,
      tone: i.status === 'paid' ? ('success' as const) : ('warning' as const),
    })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <div className="flex flex-col gap-5">
      <Link href="/customers" className="inline-flex w-fit items-center gap-1 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft size={14} /> Back to customers
      </Link>

      <Card>
        <CardBody className="flex flex-wrap items-start gap-5">
          <Avatar name={customer.name} src={customer.avatarUrl ?? undefined} size="xl" />
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{customer.name}</h1>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-fg-muted">
              <span className="inline-flex items-center gap-1"><Mail size={13} /> {customer.email}</span>
              <span className="inline-flex items-center gap-1"><Building2 size={13} /> {customer.company}</span>
              {customer.country && (
                <span className="inline-flex items-center gap-1"><MapPin size={13} /> {customer.country}</span>
              )}
              <span className="inline-flex items-center gap-1"><Calendar size={13} /> joined {formatRelative(customer.joinedAt)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="success" dot size="sm" className="capitalize">{customer.status}</Badge>
              <Badge tone="primary" size="sm" className="capitalize">{customer.plan}</Badge>
              {customer.tags?.map((t) => <Badge key={t} tone="neutral" size="sm">{t}</Badge>)}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="sm" variant="outline" leftIcon={<Mail size={14} />}>Email</Button>
            <Button size="sm">New deal</Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-2xs uppercase tracking-wide text-fg-subtle">Lifetime revenue</p>
            <p className="font-display text-2xl font-semibold tracking-tight"><DollarSign className="inline -mt-1" size={18} />{formatCurrency(lifetimeRevenue).replace('$', '')}</p>
            <p className="mt-1 text-xs text-fg-muted">{invoices.filter((i) => i.status === 'paid').length} paid invoices</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-2xs uppercase tracking-wide text-fg-subtle">MRR</p>
            <p className="font-display text-2xl font-semibold tracking-tight">{formatCurrency(customer.mrr)}</p>
            <p className="mt-1 text-xs text-fg-muted">Active subscription</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-2xs uppercase tracking-wide text-fg-subtle">Orders</p>
            <p className="font-display text-2xl font-semibold tracking-tight">{orders.length}</p>
            <p className="mt-1 text-xs text-fg-muted">{orders.filter((o) => o.status === 'delivered').length} delivered</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <Button size="xs" variant="ghost">Add note</Button>
          </CardHeader>
          <CardBody>
            {timeline.length ? (
              <ActivityTimeline items={timeline} />
            ) : (
              <p className="text-sm text-fg-muted">No activity yet.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <Link href="/orders" className="text-xs font-medium text-primary hover:underline">All →</Link>
          </CardHeader>
          <CardBody>
            <ul className="flex flex-col gap-2">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-fg">{o.reference}</p>
                    <p className="text-xs text-fg-subtle">{formatRelative(o.createdAt)}</p>
                  </div>
                  <p className="font-medium text-fg">{formatCurrency(o.total)}</p>
                </li>
              ))}
              {orders.length === 0 && <p className="text-sm text-fg-muted">No orders.</p>}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
