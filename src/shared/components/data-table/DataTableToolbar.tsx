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
  const hasFilters = Boolean(filterSlot);

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        hasFilters
          ? 'lg:flex-row lg:items-start lg:justify-between'
          : 'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      data-testid="data-table-toolbar"
    >
      <Input
        value={globalFilter}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        placeholder={searchPlaceholder}
        className={cn('w-full shrink-0', hasFilters ? 'lg:max-w-xs' : 'sm:max-w-xs')}
        aria-label={searchPlaceholder}
      />
      {filterSlot ? <div className="min-w-0 w-full lg:flex-1">{filterSlot}</div> : null}
    </div>
  );
}
