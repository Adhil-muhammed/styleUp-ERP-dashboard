import type { Table } from '@tanstack/react-table';
import type React from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  rowCount: number;
  labels: {
    previous: string;
    next: string;
    page: (current: number, total: number) => string;
    rowsPerPage: string;
  };
  className?: string;
};

export function DataTablePagination<TData>({
  table,
  rowCount,
  labels,
  className,
}: DataTablePaginationProps<TData>): React.ReactElement {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize));
  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      data-testid="data-table-pagination"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="whitespace-nowrap">{labels.rowsPerPage}</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
            table.setPageIndex(0);
          }}
        >
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm text-muted-foreground">
          {labels.page(pageIndex + 1, pageCount)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canPrevious}
            onClick={() => table.previousPage()}
          >
            {labels.previous}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canNext}
            onClick={() => table.nextPage()}
          >
            {labels.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
