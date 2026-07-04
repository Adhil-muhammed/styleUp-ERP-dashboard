import type { ReactNode } from 'react';
import type React from 'react';

import { useResponsive } from '@/shared/hooks/use-responsive';
import { cn } from '@/shared/lib/utils';
import { breakpoints, table } from '@/theme/responsive';

export type ResponsiveTableColumn<TData> = {
  id: string;
  header: ReactNode;
  cell: (row: TData) => ReactNode;
  className?: string;
};

export type ResponsiveTableProps<TData> = {
  columns: ResponsiveTableColumn<TData>[];
  data: TData[];
  renderCard: (row: TData) => ReactNode;
  getRowKey: (row: TData) => string;
  className?: string;
  cardClassName?: string;
  tableClassName?: string;
};

function shouldUseCardView(width: number): boolean {
  if (table.breakpointToCardView === 'md') {
    return width < breakpoints.md;
  }
  return width < breakpoints.md;
}

export function ResponsiveTable<TData>({
  columns,
  data,
  renderCard,
  getRowKey,
  className,
  cardClassName,
  tableClassName,
}: ResponsiveTableProps<TData>): React.ReactElement {
  const { width } = useResponsive();
  const useCardView = shouldUseCardView(width);

  if (useCardView) {
    return (
      <div className={cn('space-y-3', className)} data-testid="responsive-table-cards">
        {data.map((row) => (
          <div key={getRowKey(row)} className={cardClassName}>
            {renderCard(row)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)} data-testid="responsive-table">
      <table className={cn('w-full caption-bottom text-sm', tableClassName)}>
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'h-10 px-3 text-left align-middle font-medium text-muted-foreground',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={getRowKey(row)} className="border-b last:border-b-0">
              {columns.map((column) => (
                <td key={column.id} className={cn('p-3 align-middle', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
