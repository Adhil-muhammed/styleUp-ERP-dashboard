import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type React from 'react';

import { DataTablePagination } from '@/shared/components/data-table/DataTablePagination';
import { DataTableToolbar } from '@/shared/components/data-table/DataTableToolbar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { cn } from '@/shared/lib/utils';
import { breakpoints } from '@/theme/responsive';

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  filterSlot?: ReactNode;
  isLoading?: boolean;
  searchPlaceholder?: string;
  getRowId: (row: TData) => string;
  renderMobileCard?: (row: TData) => ReactNode;
  paginationLabels: {
    previous: string;
    next: string;
    page: (current: number, total: number) => string;
    rowsPerPage: string;
  };
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
  className?: string;
};

export function DataTable<TData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  globalFilter,
  onGlobalFilterChange,
  filterSlot,
  isLoading = false,
  searchPlaceholder,
  getRowId,
  renderMobileCard,
  paginationLabels,
  sorting,
  onSortingChange,
  manualSorting = false,
  className,
}: DataTableProps<TData>): React.ReactElement {
  const { width } = useResponsive();
  const useCardView = width < breakpoints.md && renderMobileCard !== undefined;

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
      ...(sorting !== undefined ? { sorting } : {}),
    },
    onPaginationChange,
    ...(onSortingChange !== undefined ? { onSortingChange } : {}),
    manualPagination: true,
    manualFiltering: true,
    manualSorting,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => getRowId(row),
  });

  return (
    <div className={cn('space-y-4', className)} data-testid="data-table">
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
        searchPlaceholder={searchPlaceholder}
        filterSlot={filterSlot}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: pagination.pageSize }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : useCardView ? (
        <div className="space-y-3" data-testid="data-table-cards">
          {data.map((row) => (
            <div key={getRowId(row)}>{renderMobileCard(row)}</div>
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border">
          <table className="w-full caption-bottom text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-10 px-3 text-left align-middle font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 px-3 text-center text-muted-foreground"
                  >
                    —
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <DataTablePagination table={table} rowCount={rowCount} labels={paginationLabels} />
    </div>
  );
}
