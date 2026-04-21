import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bell, History, Lock, Network, Settings, Shield } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@/components/atoms/Switch';
import { Badge } from '@/components/atoms/Badge';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  await requireRole('admin');
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-fg-muted">Workspace, security, and integrations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general"><Settings size={13} className="mr-1.5" /> General</TabsTrigger>
          <TabsTrigger value="security"><Shield size={13} className="mr-1.5" /> Security</TabsTrigger>
          <TabsTrigger value="integrations"><Network size={13} className="mr-1.5" /> Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>Workspace</CardTitle></CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Workspace name"><Input defaultValue="Renovate Inc." /></FormField>
              <FormField label="Time zone"><Input defaultValue="UTC" /></FormField>
              <FormField label="Default locale"><Input defaultValue="en-US" /></FormField>
              <FormField label="Currency"><Input defaultValue="USD" /></FormField>
            </CardBody>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle><Bell size={14} className="mr-1 inline -mt-0.5" /> Email defaults</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              <Setting label="Send weekly digest" desc="Send admins a usage summary every Monday." />
              <Setting label="Notify on new customer" desc="Email admins when a customer signs up." />
              <Setting label="Notify on overdue invoices" desc="Email finance when an invoice goes overdue." />
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle><Lock size={14} className="mr-1 inline -mt-0.5" /> Authentication</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              <Setting label="Require strong passwords" desc="Reject passwords under 8 characters." defaultChecked />
              <Setting label="Two-factor for admins" desc="Force authenticator-app codes on sign-in." />
              <Setting label="Session timeout" desc="Log out idle sessions after 24 hours." defaultChecked />
            </CardBody>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Audit log</CardTitle>
              <Badge tone="primary" size="sm">Tamper-evident</Badge>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-fg-muted">All admin write actions are logged automatically.</p>
              <Link href="/admin/activity" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                <History size={13} /> Open activity log <ArrowRight size={12} />
              </Link>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { name: 'Slack', desc: 'Send activity notifications to a channel.', tone: 'primary' as const },
              { name: 'Google Workspace', desc: 'SSO + calendar sync.', tone: 'accent' as const },
              { name: 'Stripe', desc: 'Sync invoices and subscriptions.', tone: 'info' as const },
              { name: 'Linear', desc: 'Pull tasks into the Kanban board.', tone: 'success' as const },
              { name: 'PostgreSQL', desc: 'Replace lowdb with Postgres in /lib/db.ts.', tone: 'warning' as const },
              { name: 'Webhooks', desc: 'POST events to your own endpoint.', tone: 'neutral' as const },
            ].map((i) => (
              <Card key={i.name}>
                <CardBody className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded bg-primary-soft text-primary font-display font-semibold">
                    {i.name[0]}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-fg">{i.name}</p>
                    <p className="text-sm text-fg-muted">{i.desc}</p>
                    <Badge tone="neutral" size="sm" className="mt-1.5">Placeholder</Badge>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Setting({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="text-xs text-fg-muted">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
