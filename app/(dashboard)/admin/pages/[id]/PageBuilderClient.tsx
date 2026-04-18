'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import {
  ChevronLeft, ChevronRight, GripVertical, Plus, Save, Settings2, Trash2, ArrowUpDown,
} from 'lucide-react';
import type { Page, WidgetInstance } from '@/types';
import { listWidgets } from '@/widgets/registry';
import { Button } from '@/components/atoms/Button';
import { Input, Textarea } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { FormField } from '@/components/molecules/FormField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { WidgetGrid } from '@/components/organisms/WidgetRenderer';
import { Modal } from '@/components/organisms/Modal';
import { cn } from '@/lib/utils/cn';

const SPAN_OPTIONS: NonNullable<WidgetInstance['span']>[] = [3, 4, 6, 12];

export function PageBuilderClient({ page }: { page: Page }) {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Page>(page);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<WidgetInstance | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const widgets = listWidgets();

  const addWidget = (type: string) => {
    const def = widgets.find((w) => w.type === type);
    if (!def) return;
    const next: WidgetInstance = {
      id: uuid(),
      type,
      config: { ...def.defaultConfig },
      span: def.defaultSpan ?? 6,
    };
    setDraft({ ...draft, widgets: [...draft.widgets, next] });
    setPickerOpen(false);
  };

  const removeWidget = (id: string) => {
    setDraft({ ...draft, widgets: draft.widgets.filter((w) => w.id !== id) });
  };

  const updateWidget = (id: string, patch: Partial<WidgetInstance>) => {
    setDraft({
      ...draft,
      widgets: draft.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    });
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = draft.widgets.findIndex((w) => w.id === id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= draft.widgets.length) return;
    const arr = draft.widgets.slice();
    [arr[idx], arr[next]] = [arr[next]!, arr[idx]!];
    setDraft({ ...draft, widgets: arr });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          slug: draft.slug,
          description: draft.description,
          layout: draft.layout,
          widgets: draft.widgets,
        }),
      });
      if (res.ok) {
        setSavedAt(new Date().toLocaleTimeString());
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Button size="xs" variant="ghost" asChild>
            <a href="/admin/pages"><ChevronLeft size={12} /> All pages</a>
          </Button>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{draft.title}</h1>
          <p className="text-sm text-fg-muted">/{draft.slug} · {draft.widgets.length} widgets</p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <Badge tone="success" size="sm">Saved at {savedAt}</Badge>}
          <Button size="sm" variant="outline" leftIcon={<Plus size={14} />} onClick={() => setPickerOpen(true)}>
            Add widget
          </Button>
          <Button size="sm" loading={saving} onClick={save} leftIcon={<Save size={14} />}>
            Save page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Page settings</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              <FormField label="Title">
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </FormField>
              <FormField label="Slug">
                <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
              </FormField>
              <FormField label="Description">
                <Textarea
                  value={draft.description ?? ''}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </FormField>
              <FormField label="Layout">
                <SegmentedControl
                  size="sm"
                  value={draft.layout}
                  onChange={(layout) => setDraft({ ...draft, layout })}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'wide', label: 'Wide' },
                    { value: 'split', label: 'Split' },
                  ]}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Widgets ({draft.widgets.length})</CardTitle></CardHeader>
            <CardBody className="p-2">
              {draft.widgets.length === 0 ? (
                <p className="px-3 py-4 text-sm text-fg-muted">No widgets yet. Click <em>Add widget</em>.</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {draft.widgets.map((w, i) => {
                    const def = widgets.find((d) => d.type === w.type);
                    return (
                      <li
                        key={w.id}
                        className="group flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 hover:border-border hover:bg-surface-2/40"
                      >
                        <GripVertical size={12} className="text-fg-subtle" />
                        <span className="text-fg-subtle">{def?.icon}</span>
                        <span className="flex-1 truncate text-sm">{def?.label ?? w.type}</span>
                        <Badge tone="neutral" size="sm">{w.span}/12</Badge>
                        <div className="flex opacity-0 group-hover:opacity-100">
                          <Button size="icon" variant="ghost" aria-label="Up" onClick={() => move(w.id, -1)} disabled={i === 0}>
                            <ChevronLeft size={12} className="rotate-90" />
                          </Button>
                          <Button size="icon" variant="ghost" aria-label="Down" onClick={() => move(w.id, 1)} disabled={i === draft.widgets.length - 1}>
                            <ChevronRight size={12} className="rotate-90" />
                          </Button>
                          <Button size="icon" variant="ghost" aria-label="Configure" onClick={() => setEditing(w)}>
                            <Settings2 size={12} />
                          </Button>
                          <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => removeWidget(w.id)}>
                            <Trash2 size={12} className="text-danger" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className={cn('rounded-lg border border-dashed border-border bg-surface-2/30 p-4')}>
          <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-2xs font-medium text-fg-subtle">
            Live preview
          </p>
          <WidgetGrid widgets={draft.widgets} />
        </div>
      </div>

      <Modal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Add a widget"
        description="Each widget is plugin-registered — pick one to insert it."
        size="lg"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {widgets.map((w) => (
            <button
              key={w.type}
              onClick={() => addWidget(w.type)}
              className="flex items-start gap-3 rounded-md border border-border bg-surface p-3 text-left transition-colors hover:bg-surface-2"
            >
              <span className="grid h-8 w-8 place-items-center rounded bg-primary-soft text-primary">{w.icon}</span>
              <span>
                <span className="block font-medium text-fg">{w.label}</span>
                {w.description && <span className="block text-xs text-fg-muted">{w.description}</span>}
              </span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing ? `Configure: ${listWidgets().find((w) => w.type === editing.type)?.label}` : ''}
        size="md"
        footer={<Button size="sm" onClick={() => setEditing(null)}>Done</Button>}
      >
        {editing && (
          <ConfigureForm
            widget={editing}
            onChange={(patch) => {
              updateWidget(editing.id, patch);
              setEditing({ ...editing, ...patch });
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function ConfigureForm({
  widget,
  onChange,
}: {
  widget: WidgetInstance;
  onChange: (patch: Partial<WidgetInstance>) => void;
}) {
  const def = listWidgets().find((d) => d.type === widget.type);
  const fields = def ? Object.keys(def.defaultConfig) : [];
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <FormField key={f} label={f}>
          <Input
            value={String((widget.config[f] as string | number | undefined) ?? '')}
            onChange={(e) => onChange({ config: { ...widget.config, [f]: e.target.value } })}
          />
        </FormField>
      ))}
      <FormField label="Width (out of 12)">
        <SegmentedControl<string>
          size="sm"
          value={String(widget.span ?? 6)}
          onChange={(v) => onChange({ span: Number(v) as WidgetInstance['span'] })}
          options={SPAN_OPTIONS.map((s) => ({ value: String(s), label: `${s}/12`, icon: <ArrowUpDown size={11} /> }))}
        />
      </FormField>
    </div>
  );
}
