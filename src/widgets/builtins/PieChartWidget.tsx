'use client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/components/organisms/ChartCard';

const data = [
  { name: 'Free', value: 240 },
  { name: 'Pro', value: 120 },
  { name: 'Enterprise', value: 30 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--info))'];

export function PieChartWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { title?: string };
  return (
    <ChartCard title={c.title ?? 'Breakdown'}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
