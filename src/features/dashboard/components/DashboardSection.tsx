import type { ReactNode } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/shared/components/empty-state/EmptyState';
import { Skeleton } from '@/shared/components/ui/skeleton';

export interface DashboardSectionProps {
  isPending?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  skeleton?: ReactNode;
  children: ReactNode;
}

export function DashboardSection({
  isPending = false,
  isError = false,
  isEmpty = false,
  emptyMessage,
  skeleton,
  children,
}: DashboardSectionProps): React.ReactElement {
  const { t } = useTranslation('dashboard');

  if (isPending) {
    return (
      <>
        {skeleton ?? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </>
    );
  }

  if (isError) {
    return <EmptyState title={t('errors.loadFailed')} />;
  }

  if (isEmpty) {
    return <EmptyState title={emptyMessage ?? t('empty.chart')} />;
  }

  return <>{children}</>;
}
