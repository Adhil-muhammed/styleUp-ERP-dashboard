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

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type CursorDataTablePaginationProps = {
  hasMore: boolean;
  canPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  labels: {
    previous: string;
    next: string;
    rowsPerPage: string;
  };
  className?: string;
};

export function CursorDataTablePagination({
  hasMore,
  canPrevious,
  onNext,
  onPrevious,
  limit,
  onLimitChange,
  labels,
  className,
}: CursorDataTablePaginationProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      data-testid="cursor-data-table-pagination"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="whitespace-nowrap">{labels.rowsPerPage}</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
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

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" size="sm" disabled={!canPrevious} onClick={onPrevious}>
          {labels.previous}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!hasMore} onClick={onNext}>
          {labels.next}
        </Button>
      </div>
    </div>
  );
}
