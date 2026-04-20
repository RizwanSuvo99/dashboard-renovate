'use client';
import * as React from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import type { NavItem } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { FormField } from '@/components/molecules/FormField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { Badge } from '@/components/atoms/Badge';
import { v4 as uuid } from 'uuid';

const GROUPS = ['main', 'workspace', 'admin'] as const;

export function NavigationBuilderClient({ initial }: { initial: NavItem[] }) {
  const [items, setItems] = React.useState<NavItem[]>(initial);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const grouped = React.useMemo(() => {
    const map = new Map<NavItem['group'], NavItem[]>();
    for (const g of GROUPS) map.set(g, []);
    for (const i of items) map.get(i.group ?? 'main')?.push(i);
    for (const arr of map.values()) arr.sort((a, b) => a.order - b.order);
    return map;
  }, [items]);

  const addItem = (group: NavItem['group']) => {
    const next: NavItem = {
      id: uuid(),
      label: 'New item',
      icon: 'Square',
      href: '/',
      parentId: null,
      order: items.filter((i) => i.group === group).length,
      group,
    };
    setItems([...items, next]);
  };

  const updateItem = (id: string, patch: Partial<NavItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const moveWithinGroup = (group: NavItem['group'], from: number, to: number) => {
    const arr = grouped.get(group) ?? [];
    const reordered = arrayMove(arr, from, to).map((it, idx) => ({ ...it, order: idx }));
    setItems((current) =>
      current.map((it) => (it.group === group ? reordered.find((r) => r.id === it.id) ?? it : it)),
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (res.ok) setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Navigation</h1>
          <p className="text-sm text-fg-muted">Drag items to reorder. Move them between groups by editing the group select.</p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <Badge tone="success" size="sm">Saved at {savedAt}</Badge>}
          <Button size="sm" loading={saving} onClick={save} leftIcon={<Save size={14} />}>
            Save navigation
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {GROUPS.map((group) => {
            const groupItems = grouped.get(group) ?? [];
            return (
              <Card key={group}>
                <CardHeader>
                  <CardTitle className="capitalize">{group}</CardTitle>
                  <Button size="xs" variant="ghost" onClick={() => addItem(group)} leftIcon={<Plus size={12} />}>
                    Add
                  </Button>
                </CardHeader>
                <CardBody className="p-3">
                  <SortableContext items={groupItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col gap-2">
                      {groupItems.map((it, i) => (
                        <SortableNavRow
                          key={it.id}
                          item={it}
                          onChange={(patch) => updateItem(it.id, patch)}
                          onRemove={() => removeItem(it.id)}
                          onMove={(dir) => moveWithinGroup(group, i, i + dir)}
                          isFirst={i === 0}
                          isLast={i === groupItems.length - 1}
                        />
                      ))}
                      {groupItems.length === 0 && (
                        <li className="rounded border border-dashed border-border p-3 text-center text-xs text-fg-subtle">
                          No items in {group}.
                        </li>
                      )}
                    </ul>
                  </SortableContext>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

function SortableNavRow({
  item,
  onChange,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: {
  item: NavItem;
  onChange: (patch: Partial<NavItem>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-border bg-surface p-2"
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab text-fg-subtle hover:text-fg active:cursor-grabbing" aria-label="Drag">
          <GripVertical size={14} />
        </button>
        <FormField label="">
          <Input
            value={item.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Label"
            className="h-8"
          />
        </FormField>
        <Button size="icon" variant="ghost" aria-label="Remove" onClick={onRemove}>
          <Trash2 size={12} className="text-danger" />
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Input
          className="h-8"
          value={item.href ?? ''}
          onChange={(e) => onChange({ href: e.target.value })}
          placeholder="/href"
        />
        <Input
          className="h-8"
          value={item.icon ?? ''}
          onChange={(e) => onChange({ icon: e.target.value })}
          placeholder="Icon (Lucide name)"
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <SegmentedControl
          size="sm"
          value={item.group ?? 'main'}
          onChange={(group) => onChange({ group })}
          options={[
            { value: 'main', label: 'Main' },
            { value: 'workspace', label: 'Workspace' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => onMove(-1)} disabled={isFirst} aria-label="Move up">↑</Button>
          <Button size="icon" variant="ghost" onClick={() => onMove(1)} disabled={isLast} aria-label="Move down">↓</Button>
        </div>
      </div>
    </li>
  );
}
