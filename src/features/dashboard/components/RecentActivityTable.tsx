import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useActivityColumns } from '@/features/dashboard/components/activity-columns';
import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { renderActivityCard } from '@/features/dashboard/components/RecentActivityList';
import { useDashboardActivityQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import type { ActivityTab } from '@/features/dashboard/types/dashboard-activity';
import { DataTable } from '@/shared/components/data-table/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';

const ALL_FILTER = 'all';

type RecentActivityTableProps = {
  tab: ActivityTab;
};

function ActivityTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

function ActivityEnumFilter({
  tab,
  value,
  onChange,
}: {
  tab: ActivityTab;
  value: string;
  onChange: (value: string) => void;
}): React.ReactElement | null {
  const { t } = useTranslation('dashboard');

  if (tab === 'bookings') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('activity.columns.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER}>{t('activity.filterAll')}</SelectItem>
          <SelectItem value="confirmed">{t('activity.status.confirmed')}</SelectItem>
          <SelectItem value="completed">{t('activity.status.completed')}</SelectItem>
          <SelectItem value="cancelled">{t('activity.status.cancelled')}</SelectItem>
          <SelectItem value="pending">{t('activity.status.pending')}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (tab === 'registrations') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('activity.columns.type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER}>{t('activity.filterAll')}</SelectItem>
          <SelectItem value="customer">{t('activity.types.customer')}</SelectItem>
          <SelectItem value="merchant">{t('activity.types.merchant')}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (tab === 'refunds') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('activity.columns.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER}>{t('activity.filterAll')}</SelectItem>
          <SelectItem value="pending">{t('activity.status.pending')}</SelectItem>
          <SelectItem value="processed">{t('activity.status.processed')}</SelectItem>
          <SelectItem value="failed">{t('activity.status.failed')}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (tab === 'alerts') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('activity.columns.severity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER}>{t('activity.filterAll')}</SelectItem>
          <SelectItem value="info">{t('activity.severity.info')}</SelectItem>
          <SelectItem value="warning">{t('activity.severity.warning')}</SelectItem>
          <SelectItem value="critical">{t('activity.severity.critical')}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return null;
}

export function RecentActivityTable({ tab }: RecentActivityTableProps): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const columns = useActivityColumns(tab);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [search, setSearch] = useState('');
  const [enumFilter, setEnumFilter] = useState(ALL_FILTER);
  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleEnumFilterChange = (value: string): void => {
    setEnumFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo(() => {
    const base = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
    };

    if (tab === 'bookings' || tab === 'refunds') {
      return {
        ...base,
        status: enumFilter === ALL_FILTER ? undefined : enumFilter,
      };
    }
    if (tab === 'registrations') {
      return {
        ...base,
        type: enumFilter === ALL_FILTER ? undefined : enumFilter,
      };
    }
    if (tab === 'alerts') {
      return {
        ...base,
        severity: enumFilter === ALL_FILTER ? undefined : enumFilter,
      };
    }
    return base;
  }, [tab, pagination.pageIndex, pagination.pageSize, debouncedSearch, enumFilter]);

  const { data, isPending, isError, isFetching } = useDashboardActivityQuery(tab, queryParams);

  const filterSlot =
    tab === 'reviews' ? null : (
      <ActivityEnumFilter tab={tab} value={enumFilter} onChange={handleEnumFilterChange} />
    );

  return (
    <DashboardSection
      isPending={isPending}
      isError={isError}
      isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
      emptyMessage={t('empty.activity')}
      skeleton={<ActivityTableSkeleton />}
    >
      {data ? (
        <DataTable
          columns={columns}
          data={data.data}
          rowCount={data.total}
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={search}
          onGlobalFilterChange={handleSearchChange}
          filterSlot={filterSlot}
          isLoading={isFetching && !isPending}
          searchPlaceholder={t('activity.searchPlaceholder')}
          getRowId={(row) => row.id}
          renderMobileCard={(row) => (
            <div className="rounded-lg border bg-card p-3">{renderActivityCard(tab, row)}</div>
          )}
          paginationLabels={{
            previous: t('activity.pagination.previous'),
            next: t('activity.pagination.next'),
            page: (current, total) => t('activity.pagination.page', { current, total }),
            rowsPerPage: t('activity.pagination.rowsPerPage'),
          }}
        />
      ) : null}
    </DashboardSection>
  );
}
