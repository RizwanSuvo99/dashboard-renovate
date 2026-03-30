'use client';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompact, formatCurrency } from '@/lib/utils/format';

export interface RevenuePoint {
  label: string;
  value: number;
  prev?: number;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.36} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rev-fill-prev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.18} />
            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--fg-subtle))" fontSize={12} />
        <YAxis
          tickFormatter={(v) => formatCompact(v as number)}
          tickLine={false}
          axisLine={false}
          stroke="hsl(var(--fg-subtle))"
          fontSize={12}
          width={40}
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          contentStyle={{
            background: 'hsl(var(--surface))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value: number, name) => [formatCurrency(value), name === 'value' ? 'This year' : 'Last year']}
        />
        {data[0]?.prev !== undefined && (
          <Area
            type="monotone"
            dataKey="prev"
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            fill="url(#rev-fill-prev)"
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#rev-fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
