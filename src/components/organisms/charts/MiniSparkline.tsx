'use client';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export function MiniSparkline({ data, tone = 'primary' }: { data: number[]; tone?: 'primary' | 'accent' | 'success' | 'danger' }) {
  const color = tone === 'primary' ? 'hsl(var(--primary))'
    : tone === 'accent' ? 'hsl(var(--accent))'
    : tone === 'success' ? 'hsl(var(--success))'
    : 'hsl(var(--danger))';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${tone})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
