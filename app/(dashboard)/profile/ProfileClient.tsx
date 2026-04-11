'use client';
import * as React from 'react';
import { Camera, Save, Mail, Lock } from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@/components/atoms/Switch';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { FormField } from '@/components/molecules/FormField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs';

export function ProfileClient({ user }: { user: { id: string; name: string; email: string; role: string } }) {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [productNotif, setProductNotif] = React.useState(true);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-fg-muted">Update your personal information and preferences</p>
      </div>

      <Card>
        <CardBody className="flex items-center gap-5">
          <div className="relative">
            <Avatar name={name} size="xl" />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-surface bg-primary text-primary-fg shadow-sm hover:bg-primary/90"
              aria-label="Upload avatar"
            >
              <Camera size={12} />
            </button>
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">{name}</p>
            <p className="text-sm text-fg-muted">{email}</p>
            <Badge tone="primary" size="sm" className="mt-1.5 capitalize">{user.role}</Badge>
          </div>
        </CardBody>
      </Card>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Full name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <FormField label="Email">
                <Input type="email" leftAdornment={<Mail size={14} />} value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormField>
              <FormField label="Time zone">
                <Input defaultValue="UTC" />
              </FormField>
              <FormField label="Locale">
                <Input defaultValue="en-US" />
              </FormField>
              <div className="md:col-span-2 flex justify-end">
                <Button leftIcon={<Save size={14} />}>Save changes</Button>
              </div>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Current password">
                <Input type="password" leftAdornment={<Lock size={14} />} />
              </FormField>
              <FormField label="New password">
                <Input type="password" leftAdornment={<Lock size={14} />} />
              </FormField>
              <div className="md:col-span-2 flex justify-end">
                <Button>Update password</Button>
              </div>
            </CardBody>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Two-factor</CardTitle>
            </CardHeader>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fg">Authenticator app</p>
                <p className="text-xs text-fg-muted">Use an authenticator app to generate codes.</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email notifications</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {[
                { id: 'e', label: 'Account activity', desc: 'Sign-ins, password changes', value: emailNotif, onChange: setEmailNotif },
                { id: 'p', label: 'Product updates', desc: 'New features and tips', value: productNotif, onChange: setProductNotif },
              ].map((row) => (
                <div key={row.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fg">{row.label}</p>
                    <p className="text-xs text-fg-muted">{row.desc}</p>
                  </div>
                  <Switch checked={row.value} onCheckedChange={row.onChange} />
                </div>
              ))}
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
