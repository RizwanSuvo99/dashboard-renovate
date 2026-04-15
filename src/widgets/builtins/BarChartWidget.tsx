'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/organisms/ChartCard';

const data = [
  { label: 'NA', value: 142 },
  { label: 'EU', value: 98 },
  { label: 'APAC', value: 76 },
  { label: 'SA', value: 41 },
  { label: 'AF', value: 28 },
];

export function BarChartWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { title?: string; description?: string };
  return (
    <ChartCard title={c.title ?? 'Bars'} description={c.description}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
          <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
          <Tooltip cursor={{ fill: 'hsl(var(--surface-2))' }} contentStyle={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
