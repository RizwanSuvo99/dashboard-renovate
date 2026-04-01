'use client';
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type Table as TableType,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronUp, Eye, EyeOff, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { SearchBar } from '@/components/molecules/SearchBar';
import { Pagination } from '@/components/molecules/Pagination';
import { EmptyState } from '@/components/molecules/EmptyState';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu';

export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  /** Enable global search by these row fields. */
  searchableFields?: Array<keyof T>;
  /** Render a row click handler (drawer / detail). */
  onRowClick?: (row: T) => void;
  /** Render bulk actions when selection is enabled. */
  bulkActions?: (selected: T[], clear: () => void) => React.ReactNode;
  /** Page size; default 10. */
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  /** Optional toolbar slot rendered above the table. */
  toolbar?: React.ReactNode;
  /** Initial sort state. */
  initialSort?: SortingState;
  className?: string;
}

/**
 * Reusable table built on TanStack Table. Use the `columnHelper` pattern in
 * the page that owns the data:
 *
 *   const helper = createColumnHelper<Customer>();
 *   const columns = [
 *     helper.accessor('name', { header: 'Name', cell: (r) => ... }),
 *     ...
 *   ];
 */
export function DataTable<T>({
  columns,
  data,
  searchableFields,
  onRowClick,
  bulkActions,
  pageSize = 10,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'When you add records, they will show up in this table.',
  emptyIcon = <Inbox size={20} />,
  emptyAction,
  toolbar,
  initialSort,
  className,
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? []);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});

  const enrichedColumns = React.useMemo<ColumnDef<T, any>[]>(() => {
    if (!bulkActions) return columns;
    const selectColumn: ColumnDef<T, unknown> = {
      id: '__select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 32,
      enableSorting: false,
    };
    return [selectColumn, ...columns];
  }, [columns, bulkActions]);

  const table = useReactTable({
    data,
    columns: enrichedColumns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: !!bulkActions,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      if (!q) return true;
      const fields = searchableFields ?? (Object.keys(row.original as object) as Array<keyof T>);
      return fields.some((f) => String((row.original as Record<string, unknown>)[f as string] ?? '').toLowerCase().includes(q));
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { pagination: { pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selected = table.getSelectedRowModel().rows.map((r) => r.original);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar value={globalFilter} onChange={setGlobalFilter} className="md:max-w-xs" />
        {toolbar}
        <div className="ml-auto flex items-center gap-2">
          {selected.length > 0 && bulkActions && (
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary-soft/60 px-2.5 py-1 text-xs text-primary">
              <span className="font-medium">{selected.length} selected</span>
              {bulkActions(selected, () => setRowSelection({}))}
            </div>
          )}
          <ColumnVisibilityMenu table={table} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-2/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sort = header.column.getIsSorted();
                    const sortable = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'whitespace-nowrap px-4 py-2.5 text-left text-2xs font-semibold uppercase tracking-wide text-fg-subtle',
                          sortable && 'cursor-pointer select-none hover:text-fg',
                        )}
                        style={{ width: header.getSize() === 150 ? undefined : header.getSize() }}
                        onClick={sortable ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {sortable &&
                            (sort === 'asc' ? <ChevronUp size={12} /> : sort === 'desc' ? <ChevronDown size={12} /> : <ArrowUpDown size={11} className="opacity-40" />)}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={enrichedColumns.length}>
                    <EmptyState
                      icon={emptyIcon}
                      title={emptyTitle}
                      description={emptyDescription}
                      action={emptyAction}
                      size="sm"
                    />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      'border-b border-border/60 last:border-0 transition-colors',
                      onRowClick ? 'cursor-pointer hover:bg-surface-2/60' : 'hover:bg-surface-2/40',
                      row.getIsSelected() && 'bg-primary-soft/40',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-4 py-3 text-fg">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {table.getPageCount() > 1 && (
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          pageCount={table.getPageCount()}
          total={table.getFilteredRowModel().rows.length}
          onPageChange={(p) => table.setPageIndex(p - 1)}
        />
      )}
    </div>
  );
}

function ColumnVisibilityMenu<T>({ table }: { table: TableType<T> }) {
  const hideable = table.getAllLeafColumns().filter((c) => c.getCanHide() && c.id !== '__select');
  if (hideable.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" leftIcon={<Eye size={13} />}>
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
          >
            <span className="capitalize">{String(column.columnDef.header ?? column.id)}</span>
            {column.getIsVisible() ? null : <EyeOff size={12} className="ml-auto opacity-50" />}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
