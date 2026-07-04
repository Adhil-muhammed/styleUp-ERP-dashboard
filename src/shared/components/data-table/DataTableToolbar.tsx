import type { ReactNode } from 'react';
import type React from 'react';

import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

export type DataTableToolbarProps = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  filterSlot?: ReactNode;
  className?: string;
};

export function DataTableToolbar({
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = 'Search...',
  filterSlot,
  className,
}: DataTableToolbarProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      data-testid="data-table-toolbar"
    >
      <Input
        value={globalFilter}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="w-full sm:max-w-xs"
        aria-label={searchPlaceholder}
      />
      {filterSlot ? <div className="shrink-0">{filterSlot}</div> : null}
    </div>
  );
}
