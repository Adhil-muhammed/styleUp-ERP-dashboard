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
import {
  CursorDataTablePagination,
  type CursorDataTablePaginationProps,
} from '@/shared/components/data-table/CursorDataTablePagination';
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
  onRowClick?: (row: TData) => void;
  paginationMode?: 'offset' | 'cursor';
  cursorPagination?: Omit<CursorDataTablePaginationProps, 'className'>;
  toolbarEndSlot?: ReactNode;
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
  onRowClick,
  paginationMode = 'offset',
  cursorPagination,
  toolbarEndSlot,
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
        endSlot={toolbarEndSlot}
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
            <div
              key={getRowId(row)}
              className={onRowClick ? 'cursor-pointer' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
            >
              {renderMobileCard(row)}
            </div>
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
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b last:border-b-0',
                      onRowClick && 'cursor-pointer hover:bg-muted/50',
                    )}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  >
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

      {paginationMode === 'cursor' && cursorPagination ? (
        <CursorDataTablePagination {...cursorPagination} />
      ) : (
        <DataTablePagination table={table} rowCount={rowCount} labels={paginationLabels} />
      )}
    </div>
  );
}
