'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, FileEdit, Plus, Trash2 } from 'lucide-react';
import type { Page } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardBody } from '@/components/molecules/Card';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Modal } from '@/components/organisms/Modal';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatRelative } from '@/lib/utils/format';

const Schema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers, dashes'),
  description: z.string().optional(),
});
type Values = z.infer<typeof Schema>;

export function PagesIndexClient({ initial }: { initial: Page[] }) {
  const router = useRouter();
  const [pages, setPages] = React.useState(initial);
  const [open, setOpen] = React.useState(false);

  const form = useForm<Values>({ resolver: zodResolver(Schema), defaultValues: { title: '', slug: '', description: '' } });

  const submit = async (values: Values) => {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, layout: 'standard', widgets: [] }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      form.setError('slug', { message: data.error ?? 'Could not create page' });
      return;
    }
    const created = (await res.json()) as Page;
    setPages([created, ...pages]);
    setOpen(false);
    form.reset();
    router.push(`/admin/pages/${created.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    setPages(pages.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-sm text-fg-muted">Build dashboards by composing widgets — no redeploy needed.</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setOpen(true)}>
          New page
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<FileEdit size={20} />}
              title="No pages yet"
              description="Create one to compose widgets like KPIs, charts, and tables."
              action={
                <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus size={14} />}>
                  New page
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Card key={p.id} interactive>
              <CardBody className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-md font-semibold tracking-tight">{p.title}</p>
                    <p className="text-xs text-fg-subtle">/{p.slug}</p>
                  </div>
                  <Badge tone="neutral" size="sm">{p.widgets.length} widgets</Badge>
                </div>
                {p.description && <p className="line-clamp-2 text-sm text-fg-muted">{p.description}</p>}
                <p className="text-2xs text-fg-subtle">Updated {formatRelative(p.updatedAt)}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Button size="xs" variant="outline" asChild>
                    <Link href={`/admin/pages/${p.id}`}>
                      <FileEdit size={12} /> Edit
                    </Link>
                  </Button>
                  <Button size="xs" variant="ghost" asChild>
                    <Link href={`/${p.slug}`}>
                      <ExternalLink size={12} /> View
                    </Link>
                  </Button>
                  <Button size="xs" variant="ghost" className="ml-auto text-danger" onClick={() => remove(p.id)}>
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="New page"
        description="Pages render at /your-slug and are listed in the navigation builder."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" loading={form.formState.isSubmitting} onClick={form.handleSubmit(submit)}>Create</Button>
          </>
        }
      >
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-3">
          <FormField label="Title" error={form.formState.errors.title?.message} required>
            <Input {...form.register('title')} placeholder="Team dashboard" />
          </FormField>
          <FormField
            label="Slug"
            error={form.formState.errors.slug?.message}
            description="Renders at /<slug>"
            required
          >
            <Input {...form.register('slug')} placeholder="team-dashboard" />
          </FormField>
          <FormField label="Description">
            <Input {...form.register('description')} placeholder="Optional summary" />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
