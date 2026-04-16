'use client';
import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getWidget } from '@/widgets/registry';
import { Card, CardBody } from '@/components/molecules/Card';
import type { WidgetInstance } from '@/types';
import { cn } from '@/lib/utils/cn';

const SPAN_CLASS: Record<NonNullable<WidgetInstance['span']>, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  12: 'lg:col-span-12',
};

/**
 * Renders a list of widget instances in a 12-column grid. Each widget's
 * registered Component receives its config; if validation fails or the type
 * is unknown, a soft error card is shown.
 */
export function WidgetGrid({ widgets }: { widgets: WidgetInstance[] }) {
  if (widgets.length === 0) {
    return (
      <Card>
        <CardBody className="py-10 text-center text-sm text-fg-muted">
          This page is empty. Open the page builder to add widgets.
        </CardBody>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {widgets.map((w) => (
        <div key={w.id} className={cn(SPAN_CLASS[w.span ?? 6])}>
          <WidgetSlot widget={w} />
        </div>
      ))}
    </div>
  );
}

function WidgetSlot({ widget }: { widget: WidgetInstance }) {
  const def = getWidget(widget.type);
  if (!def) {
    return (
      <Card className="border-warning/40 bg-warning/5">
        <CardBody className="flex items-center gap-2 text-sm text-[hsl(var(--warning))]">
          <AlertTriangle size={14} /> Unknown widget type: <code>{widget.type}</code>
        </CardBody>
      </Card>
    );
  }
  const parsed = def.schema.safeParse(widget.config);
  const config = parsed.success ? parsed.data : def.defaultConfig;
  const Comp = def.Component;
  return <Comp config={config as Record<string, unknown>} />;
}
