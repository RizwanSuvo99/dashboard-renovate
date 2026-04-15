'use client';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartCard } from '@/components/organisms/ChartCard';

function makeData(seed: number) {
  return Array.from({ length: 12 }).map((_, i) => ({
    label: `W${i + 1}`,
    a: Math.round(20 + Math.sin(i / 2 + seed) * 10 + Math.random() * 6),
    b: Math.round(30 + Math.cos(i / 3 + seed) * 12 + Math.random() * 6),
  }));
}

export function LineChartWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { title?: string; description?: string; seed?: number };
  const data = makeData(c.seed ?? 7);
  return (
    <ChartCard title={c.title ?? 'Trend'} description={c.description}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
          <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
          <Tooltip contentStyle={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
          <Line type="monotone" dataKey="a" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="b" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
