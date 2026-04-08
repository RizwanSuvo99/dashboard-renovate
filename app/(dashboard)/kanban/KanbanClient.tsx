'use client';
import * as React from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Tag, Calendar as CalendarIcon } from 'lucide-react';
import type { KanbanTask } from '@/types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { cn } from '@/lib/utils/cn';

const COLUMNS: Array<{ key: KanbanTask['status']; label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = [
  { key: 'backlog', label: 'Backlog', tone: 'neutral' },
  { key: 'todo', label: 'To do', tone: 'info' },
  { key: 'doing', label: 'In progress', tone: 'warning' },
  { key: 'review', label: 'Review', tone: 'accent' },
  { key: 'done', label: 'Done', tone: 'success' },
];

const priorityTone: Record<KanbanTask['priority'], Parameters<typeof Badge>[0]['tone']> = {
  low: 'neutral',
  normal: 'info',
  high: 'warning',
  urgent: 'danger',
};

export function KanbanClient({ initial }: { initial: KanbanTask[] }) {
  const [tasks, setTasks] = React.useState<KanbanTask[]>(initial);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const groupedIds = React.useMemo(() => {
    const map = new Map<KanbanTask['status'], string[]>();
    for (const c of COLUMNS) map.set(c.key, []);
    for (const t of tasks) map.get(t.status)?.push(t.id);
    return map;
  }, [tasks]);

  const findColumn = (id: string): KanbanTask['status'] | undefined => {
    for (const [k, ids] of groupedIds) if (ids.includes(id)) return k;
    return undefined;
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const fromCol = findColumn(active.id as string);
    const overCol =
      (COLUMNS.find((c) => c.key === (over.id as KanbanTask['status']))?.key) ?? findColumn(over.id as string);
    if (!fromCol || !overCol) return;

    setTasks((current) => {
      const activeTask = current.find((t) => t.id === active.id);
      if (!activeTask) return current;
      // Same column reorder
      if (fromCol === overCol && active.id !== over.id) {
        const idsInCol = current.filter((t) => t.status === fromCol).sort((a, b) => a.order - b.order).map((t) => t.id);
        const oldIndex = idsInCol.indexOf(active.id as string);
        const newIndex = idsInCol.indexOf(over.id as string);
        const reordered = arrayMove(idsInCol, oldIndex, newIndex);
        return current.map((t) => (t.status === fromCol ? { ...t, order: reordered.indexOf(t.id) } : t));
      }
      // Cross column
      if (fromCol !== overCol) {
        return current.map((t) => (t.id === active.id ? { ...t, status: overCol } : t));
      }
      return current;
    });
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Kanban</h1>
          <p className="text-sm text-fg-muted">Drag tasks across columns to update their status</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />}>New task</Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const ids = groupedIds.get(col.key) ?? [];
            const items = ids.map((id) => tasks.find((t) => t.id === id)!).filter(Boolean);
            return (
              <Column key={col.key} columnKey={col.key} label={col.label} tone={col.tone} count={items.length}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  {items.map((t) => (
                    <SortableCard key={t.id} task={t} />
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-fg-subtle">
                      Drop tasks here
                    </div>
                  )}
                </SortableContext>
              </Column>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-2">
              <TaskCard task={activeTask} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({
  columnKey,
  label,
  tone,
  count,
  children,
}: {
  columnKey: KanbanTask['status'];
  label: string;
  tone: Parameters<typeof Badge>[0]['tone'];
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnKey });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-surface-2/40 p-3 transition-colors',
        isOver && 'border-primary/50 bg-primary-soft/40',
      )}
    >
      <header className="flex items-center justify-between">
        <Badge tone={tone} size="sm" dot>{label}</Badge>
        <span className="text-2xs font-medium text-fg-subtle">{count}</span>
      </header>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SortableCard({ task }: { task: KanbanTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

function TaskCard({ task, dragging }: { task: KanbanTask; dragging?: boolean }) {
  return (
    <Card className={cn('cursor-grab active:cursor-grabbing', dragging && 'shadow-md')}>
      <div className="p-3">
        <p className="text-sm font-medium text-fg">{task.title}</p>
        {task.description && <p className="mt-1 text-xs text-fg-muted">{task.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge tone={priorityTone[task.priority]} size="sm" dot>{task.priority}</Badge>
          {task.tags?.map((t) => (
            <Badge key={t} tone="neutral" size="sm" className="inline-flex items-center gap-1">
              <Tag size={10} /> {t}
            </Badge>
          ))}
          {task.dueAt && (
            <span className="ml-auto inline-flex items-center gap-1 text-2xs text-fg-subtle">
              <CalendarIcon size={10} /> {new Date(task.dueAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
