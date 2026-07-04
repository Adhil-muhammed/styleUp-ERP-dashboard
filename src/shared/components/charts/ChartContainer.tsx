import type { ReactNode } from 'react';
import type React from 'react';

import { EmptyState } from '@/shared/components/empty-state/EmptyState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { typography } from '@/theme/responsive';

export interface ChartContainerProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children?: ReactNode;
  className?: string;
  skeletonClassName?: string;
}

export function ChartContainer({
  title,
  description,
  action,
  isLoading = false,
  isError = false,
  errorMessage,
  isEmpty = false,
  emptyMessage,
  children,
  className,
  skeletonClassName,
}: ChartContainerProps): React.ReactElement {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-xl border bg-card p-4 ring-1 ring-foreground/10',
        className,
      )}
      data-testid="chart-container"
    >
      {(title ?? description ?? action) ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title ? <h3 className={typography.sectionTitle}>{title}</h3> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      {isLoading ? <Skeleton className={cn('w-full', skeletonClassName)} /> : null}

      {!isLoading && isError ? (
        <EmptyState title={errorMessage ?? 'Failed to load chart data'} />
      ) : null}

      {!isLoading && !isError && isEmpty ? (
        <EmptyState title={emptyMessage ?? 'No data available'} />
      ) : null}

      {!isLoading && !isError && !isEmpty ? children : null}
    </section>
  );
}
