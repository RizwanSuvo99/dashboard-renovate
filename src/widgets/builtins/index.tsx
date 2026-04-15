/**
 * Built-in widget registrations. Imported by app/layout.tsx so the registry
 * is populated before any page renders. Each widget exports a Zod schema
 * that the page builder uses to auto-generate its config form.
 */
import { z } from 'zod';
import { Activity, BarChart3, FileText, LineChart, PieChart, Square, TableProperties, Type } from 'lucide-react';
import { registerWidget } from '../registry';
import { StatCardWidget } from './StatCardWidget';
import { LineChartWidget } from './LineChartWidget';
import { BarChartWidget } from './BarChartWidget';
import { PieChartWidget } from './PieChartWidget';
import { TableWidget } from './TableWidget';
import { RichTextWidget } from './RichTextWidget';
import { DividerWidget } from './DividerWidget';
import { ActivityWidget } from './ActivityWidget';

registerWidget({
  type: 'stat-card',
  label: 'Stat card',
  icon: <Square size={14} />,
  description: 'A single KPI with optional trend.',
  schema: z.object({
    label: z.string().default('Stat'),
    value: z.string().default('1,234'),
    delta: z.coerce.number().optional(),
    caption: z.string().optional(),
  }),
  defaultConfig: { label: 'Active users', value: '1,234', delta: 8.4, caption: 'vs last week' },
  defaultSpan: 3,
  Component: StatCardWidget,
});

registerWidget({
  type: 'line-chart',
  label: 'Line chart',
  icon: <LineChart size={14} />,
  description: 'Trend line with one or two series.',
  schema: z.object({
    title: z.string().default('Trend'),
    description: z.string().optional(),
    seed: z.coerce.number().int().default(7),
  }),
  defaultConfig: { title: 'Weekly trend', description: 'Last 4 weeks', seed: 7 },
  defaultSpan: 6,
  Component: LineChartWidget,
});

registerWidget({
  type: 'bar-chart',
  label: 'Bar chart',
  icon: <BarChart3 size={14} />,
  description: 'Categorical bars.',
  schema: z.object({
    title: z.string().default('Bars'),
    description: z.string().optional(),
  }),
  defaultConfig: { title: 'By region', description: 'Distribution' },
  defaultSpan: 6,
  Component: BarChartWidget,
});

registerWidget({
  type: 'pie-chart',
  label: 'Pie chart',
  icon: <PieChart size={14} />,
  description: 'Share of total.',
  schema: z.object({
    title: z.string().default('Breakdown'),
  }),
  defaultConfig: { title: 'Plan mix' },
  defaultSpan: 4,
  Component: PieChartWidget,
});

registerWidget({
  type: 'table',
  label: 'Data table',
  icon: <TableProperties size={14} />,
  description: 'Lightweight table with title and rows.',
  schema: z.object({
    title: z.string().default('Table'),
    source: z.enum(['customers', 'products', 'orders', 'invoices']).default('customers'),
  }),
  defaultConfig: { title: 'Customers', source: 'customers' as const },
  defaultSpan: 12,
  Component: TableWidget,
});

registerWidget({
  type: 'rich-text',
  label: 'Rich text',
  icon: <Type size={14} />,
  description: 'Heading + body markdown-lite.',
  schema: z.object({
    heading: z.string().default('Section'),
    body: z.string().default('Write something here.'),
  }),
  defaultConfig: { heading: 'Welcome', body: 'Add any context for this dashboard.' },
  defaultSpan: 12,
  Component: RichTextWidget,
});

registerWidget({
  type: 'activity',
  label: 'Activity feed',
  icon: <Activity size={14} />,
  description: 'Recent admin actions.',
  schema: z.object({
    title: z.string().default('Recent activity'),
    limit: z.coerce.number().int().min(3).max(20).default(6),
  }),
  defaultConfig: { title: 'Recent activity', limit: 6 },
  defaultSpan: 6,
  Component: ActivityWidget,
});

registerWidget({
  type: 'divider',
  label: 'Divider',
  icon: <FileText size={14} />,
  description: 'Visual separator.',
  schema: z.object({ label: z.string().optional() }),
  defaultConfig: {},
  defaultSpan: 12,
  Component: DividerWidget,
});

export {};
