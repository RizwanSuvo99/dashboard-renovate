'use client';
import * as React from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis,
} from 'recharts';
import { Calendar, Download } from 'lucide-react';
import { ChartCard } from '@/components/organisms/ChartCard';
import { RevenueChart } from '@/components/organisms/charts/RevenueChart';
import { Button } from '@/components/atoms/Button';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { formatCompact, formatCurrency } from '@/lib/utils/format';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--info))', 'hsl(var(--success))', 'hsl(var(--warning))'];

export interface AnalyticsClientProps {
  revenue: { label: string; value: number; prev: number }[];
  planBreakdown: { name: string; value: number }[];
  ordersByStatus: { label: string; value: number }[];
  topProducts: { name: string; sales: number }[];
}

export function AnalyticsClient({ revenue, planBreakdown, ordersByStatus, topProducts }: AnalyticsClientProps) {
  const [range, setRange] = React.useState<'7d' | '30d' | '12m' | 'all'>('12m');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-fg-muted">Revenue, customer health, and order pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            size="sm"
            value={range}
            onChange={setRange}
            options={[
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: '12m', label: '12m' },
              { value: 'all', label: 'All' },
            ]}
          />
          <Button size="sm" variant="outline" leftIcon={<Calendar size={14} />}>Pick range</Button>
          <Button size="sm" variant="outline" leftIcon={<Download size={14} />}>Export</Button>
        </div>
      </div>

      <ChartCard
        title="Monthly revenue"
        description="Comparing this year (solid) vs last year (dashed)"
        height={320}
      >
        <RevenueChart data={revenue} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Plan breakdown" description="Customers by plan tier" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={planBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {planBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--surface))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by status" description="Pipeline distribution" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersByStatus} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--surface-2))' }}
                contentStyle={{
                  background: 'hsl(var(--surface))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Goal progress" description="Quarterly revenue target" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="95%"
              data={[{ name: 'Goal', value: 72, fill: 'hsl(var(--primary))' }]}
              startAngle={180}
              endAngle={-180}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={20} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-display fill-fg" fontSize={28} fontWeight={600}>
                72%
              </text>
              <text x="50%" y="62%" textAnchor="middle" className="fill-fg-subtle" fontSize={11}>
                of $480K target
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top products" description="Revenue contribution this period" height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topProducts} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCompact(v as number)}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--fg-subtle))"
              fontSize={11}
            />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={11} width={130} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--surface-2))' }}
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
