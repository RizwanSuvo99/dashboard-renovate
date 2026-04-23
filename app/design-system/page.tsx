import Link from 'next/link';
import { ArrowLeft, Bell, Mail, Plus, Search, Settings } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/atoms/Button';
import { Input, Textarea } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Badge } from '@/components/atoms/Badge';
import { Avatar, AvatarGroup } from '@/components/atoms/Avatar';
import { Spinner } from '@/components/atoms/Spinner';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Kbd } from '@/components/atoms/Kbd';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/molecules/Card';
import { FormField } from '@/components/molecules/FormField';
import { StatCard } from '@/components/molecules/StatCard';
import { EmptyState } from '@/components/molecules/EmptyState';
import { tokens } from '@/design-system/tokens';

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Mini Storybook documenting every atom and molecule in the Renovate design system.',
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg p-6 lg:p-10">
      <header className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg">
            <ArrowLeft size={12} /> Back to app
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Design system</h1>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            A reference for every primitive in the codebase. Use Tailwind utilities that consume CSS vars
            (like <code className="font-mono">bg-primary</code>, <code className="font-mono">text-fg-muted</code>) — they automatically
            reflect the active theme.
          </p>
        </div>
        <Badge tone="primary" size="md">v0.1</Badge>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <Section
          id="colors"
          title="Colors"
          description="Surface, foreground, primary, accent, and semantic tones — all theme-driven."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['bg', 'bg'],
              ['surface', 'bg-surface'],
              ['surface-2', 'bg-surface-2'],
              ['border', 'bg-border'],
              ['fg', 'bg-fg'],
              ['primary', 'bg-primary'],
              ['accent', 'bg-accent'],
              ['ring', 'bg-ring'],
            ].map(([name, cls]) => (
              <Swatch key={name} name={name!} className={cls!} />
            ))}
            {(['success', 'warning', 'danger', 'info'] as const).map((s) => (
              <Swatch key={s} name={s} className={`bg-${s}`} />
            ))}
          </div>
        </Section>

        <Section id="presets" title="Color presets" description="Curated palettes available in the theme customizer.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tokens.colorPresets.map((p) => (
              <div key={p.id} className="surface flex items-center gap-3 px-3 py-2.5">
                <span className="relative h-8 w-8 overflow-hidden rounded">
                  <span className="absolute inset-0" style={{ background: `hsl(${p.primary})` }} />
                  <span className="absolute right-0 top-0 h-full w-1/2" style={{ background: `hsl(${p.accent})` }} />
                </span>
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-2xs text-fg-subtle">{p.id}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="typography" title="Typography">
          <div className="surface space-y-2 px-5 py-6">
            <p className="font-display text-5xl font-semibold tracking-tight">Display 5xl</p>
            <p className="font-display text-3xl font-semibold tracking-tight">Display 3xl</p>
            <p className="font-display text-xl font-semibold tracking-tight">Display xl</p>
            <p className="text-md leading-relaxed">Body copy at <code className="font-mono">text-md</code>. The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-fg-muted">Muted body at <code className="font-mono">text-sm text-fg-muted</code>.</p>
            <p className="text-xs text-fg-subtle">Subtle helper at <code className="font-mono">text-xs text-fg-subtle</code>.</p>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="surface flex flex-wrap items-center gap-3 px-5 py-5">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
            <Button leftIcon={<Plus size={14} />}>With icon</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="surface mt-3 flex flex-wrap items-center gap-3 px-5 py-5">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="icon"><Settings size={14} /></Button>
          </div>
        </Section>

        <Section id="inputs" title="Inputs">
          <div className="surface grid gap-4 px-5 py-5 sm:grid-cols-2">
            <FormField label="Email" required>
              <Input type="email" placeholder="you@example.com" leftAdornment={<Mail size={14} />} />
            </FormField>
            <FormField label="With error" error="Required">
              <Input invalid placeholder="Required field" />
            </FormField>
            <FormField label="Disabled">
              <Input disabled placeholder="Locked" />
            </FormField>
            <FormField label="Notes">
              <Textarea rows={3} placeholder="Anything else?" />
            </FormField>
          </div>
        </Section>

        <Section id="badges" title="Badges">
          <div className="surface flex flex-wrap gap-2 px-5 py-5">
            <Badge tone="neutral">neutral</Badge>
            <Badge tone="primary" dot>primary</Badge>
            <Badge tone="success" dot>success</Badge>
            <Badge tone="warning" dot>warning</Badge>
            <Badge tone="danger" dot>danger</Badge>
            <Badge tone="info" dot>info</Badge>
            <Badge tone="accent">accent</Badge>
          </div>
        </Section>

        <Section id="avatars" title="Avatars">
          <div className="surface flex items-center gap-3 px-5 py-5">
            <Avatar name="Aria Soto" size="xs" />
            <Avatar name="Lior Park" size="sm" />
            <Avatar name="Mira Park" size="md" status="online" />
            <Avatar name="Theo Soto" size="lg" status="busy" />
            <Avatar name="Cyrus Khan" size="xl" />
            <AvatarGroup
              members={[
                { name: 'Aria Soto' },
                { name: 'Lior Park' },
                { name: 'Theo Soto' },
                { name: 'Cyrus Khan' },
                { name: 'Pia Holm' },
                { name: 'Ines Vargas' },
              ]}
            />
          </div>
        </Section>

        <Section id="loading" title="Loading">
          <div className="surface flex flex-col gap-3 px-5 py-5">
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
              <span className="ml-auto text-xs text-fg-subtle">Spinner</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-fg-subtle">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <span>opens search</span>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </Section>

        <Section id="cards" title="Cards & stats">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard label="Revenue" value="$48,920" delta={12.4} caption="vs last week" />
            <StatCard label="Sessions" value="2,408" delta={-1.6} caption="this month" />
            <StatCard label="Tickets" value="14" caption="open" />
          </div>
          <Card className="mt-3">
            <CardHeader>
              <div>
                <CardTitle>Card composition</CardTitle>
                <CardDescription>Header, body, footer. Use for any contained surface.</CardDescription>
              </div>
              <Button size="xs" variant="ghost"><Plus size={12} /> Action</Button>
            </CardHeader>
            <CardBody>Body content goes here.</CardBody>
          </Card>
        </Section>

        <Section id="empty" title="Empty states">
          <Card>
            <CardBody>
              <EmptyState
                icon={<Bell size={20} />}
                title="You're all caught up"
                description="No notifications waiting on you."
                action={<Button size="sm" leftIcon={<Search size={13} />}>Browse history</Button>}
              />
            </CardBody>
          </Card>
        </Section>

        <Section id="labels" title="Label">
          <div className="surface px-5 py-5">
            <Label htmlFor="ds-input" required>Email</Label>
            <Input id="ds-input" className="mt-1" placeholder="you@example.com" />
          </div>
        </Section>

        <p className="text-center text-xs text-fg-subtle">
          Looking for layout primitives or organisms? Open <code className="font-mono">/admin/theme</code> to see the
          components in context.
        </p>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
        <a href={`#${id}`} className="font-mono text-2xs text-fg-subtle hover:text-fg">#{id}</a>
      </header>
      {children}
    </section>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="surface overflow-hidden p-3">
      <div className={`mb-2 h-12 rounded border border-border ${className}`} />
      <p className="text-xs font-medium text-fg">{name}</p>
      <p className="font-mono text-2xs text-fg-subtle">{className.replace('bg-', '')}</p>
    </div>
  );
}
