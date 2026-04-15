'use client';
import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { Spinner } from '@/components/atoms/Spinner';
import { useQuery } from '@tanstack/react-query';

const ENDPOINTS = {
  customers: '/api/customers',
  products: '/api/products',
  orders: '/api/orders',
  invoices: '/api/invoices',
} as const;

export function TableWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { title?: string; source?: keyof typeof ENDPOINTS };
  const source = c.source ?? 'customers';
  const url = ENDPOINTS[source];

  const { data, isLoading, error } = useQuery({
    queryKey: ['widget-table', source],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as Record<string, unknown>[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{c.title ?? source}</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        {isLoading && <div className="p-5"><Spinner /></div>}
        {error && <p className="p-5 text-sm text-danger">Failed to load: {String(error)}</p>}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-2/50 text-2xs uppercase tracking-wide text-fg-subtle">
                <tr>
                  {Object.keys(data[0]).slice(0, 6).map((k) => (
                    <th key={k} className="px-4 py-2 text-left font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 8).map((row, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    {Object.keys(data[0]).slice(0, 6).map((k) => (
                      <td key={k} className="px-4 py-2">{String(row[k] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
