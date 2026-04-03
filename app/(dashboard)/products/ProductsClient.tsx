'use client';
import * as React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Grid2x2, List, Package, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@/types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card, CardBody } from '@/components/molecules/Card';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { DataTable } from '@/components/organisms/DataTable';
import { EmptyState } from '@/components/molecules/EmptyState';
import { formatCurrency } from '@/lib/utils/format';

const helper = createColumnHelper<Product>();

const stockTone = (status: Product['status']): Parameters<typeof Badge>[0]['tone'] =>
  status === 'in_stock' ? 'success' : status === 'low' ? 'warning' : 'danger';

export function ProductsClient({ initial }: { initial: Product[] }) {
  const [view, setView] = React.useState<'grid' | 'table'>('grid');

  const columns = React.useMemo(
    () => [
      helper.accessor('name', {
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded bg-primary-soft text-primary">
              <Package size={14} />
            </span>
            <div>
              <p className="font-medium text-fg">{row.original.name}</p>
              <p className="text-xs text-fg-subtle">{row.original.sku}</p>
            </div>
          </div>
        ),
      }),
      helper.accessor('category', { header: 'Category' }),
      helper.accessor('price', {
        header: 'Price',
        cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue())}</span>,
      }),
      helper.accessor('stock', {
        header: 'Stock',
        cell: ({ getValue }) => <span className="tabular-nums">{getValue().toLocaleString()}</span>,
      }),
      helper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const v = getValue();
          return <Badge tone={stockTone(v)} dot size="sm">{v.replace('_', ' ')}</Badge>;
        },
      }),
      helper.display({
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label="Edit"><Pencil size={14} /></Button>
            <Button variant="ghost" size="icon" aria-label="Delete"><Trash2 size={14} /></Button>
          </div>
        ),
      }),
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-fg-muted">{initial.length} items in your catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: 'grid', label: '', icon: <Grid2x2 size={14} /> },
              { value: 'table', label: '', icon: <List size={14} /> },
            ]}
          />
          <Button size="sm" leftIcon={<Plus size={14} />}>New product</Button>
        </div>
      </div>

      {initial.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Package size={20} />}
              title="No products yet"
              description="Create your first product to start selling."
              action={<Button size="sm" leftIcon={<Plus size={14} />}>Add product</Button>}
            />
          </CardBody>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initial.map((p) => (
            <Card key={p.id} interactive className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-soft to-accent-soft">
                <div className="absolute inset-0 bg-dotted opacity-50" />
                <div className="absolute left-3 top-3">
                  <Badge tone={stockTone(p.status)} size="sm">{p.status.replace('_', ' ')}</Badge>
                </div>
                <div className="absolute right-3 top-3 rounded bg-surface/90 px-2 py-1 text-2xs font-medium tracking-wide">
                  {p.sku}
                </div>
                <div className="absolute inset-0 grid place-items-center text-primary/40">
                  <Package size={48} />
                </div>
              </div>
              <CardBody className="flex flex-col gap-2">
                <div>
                  <p className="font-display text-md font-semibold text-fg">{p.name}</p>
                  <p className="text-xs text-fg-subtle">{p.category}</p>
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-display text-lg font-semibold tracking-tight text-fg">{formatCurrency(p.price)}</p>
                  <p className="text-xs text-fg-muted">{p.stock} in stock</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable<Product>
          columns={columns}
          data={initial}
          searchableFields={['name', 'sku', 'category']}
          pageSize={12}
          emptyTitle="No matching products"
          emptyIcon={<Package size={20} />}
        />
      )}
    </div>
  );
}
