/**
 * Example 3rd-party widget. Demonstrates how to add a new widget type without
 * touching the core. To enable:
 *
 *   1. Import this file from app/providers.tsx (or any module that runs before
 *      pages render):
 *        import '../plugins/example-counter-widget';
 *   2. The widget appears in the page builder's "Add widget" picker.
 *
 * The same shape works for widgets shipped from other npm packages — call
 * registerWidget() in the package's entry point.
 */
'use client';
import * as React from 'react';
import { z } from 'zod';
import { Plus, Minus, Activity } from 'lucide-react';
import { registerWidget } from '@/widgets/registry';
import { Button } from '@/components/atoms/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';

const Schema = z.object({
  label: z.string().default('Counter'),
  step: z.coerce.number().int().default(1),
  initial: z.coerce.number().int().default(0),
});

function CounterWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { label?: string; step?: number; initial?: number };
  const [value, setValue] = React.useState<number>(c.initial ?? 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{c.label ?? 'Counter'}</CardTitle>
        <Activity size={14} className="text-fg-subtle" />
      </CardHeader>
      <CardBody className="flex items-center justify-between gap-4">
        <p className="font-display text-4xl font-semibold tracking-tight">{value}</p>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => setValue((v) => v - (c.step ?? 1))}>
            <Minus size={14} />
          </Button>
          <Button size="icon" onClick={() => setValue((v) => v + (c.step ?? 1))}>
            <Plus size={14} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

registerWidget({
  type: 'example-counter',
  label: 'Counter (plugin)',
  icon: <Activity size={14} />,
  description: 'Example plugin widget — increments a number.',
  schema: Schema,
  defaultConfig: { label: 'My counter', step: 1, initial: 0 },
  defaultSpan: 4,
  Component: CounterWidget,
});

export {};
