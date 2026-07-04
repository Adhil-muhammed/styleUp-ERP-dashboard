import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopColumns } from '@/features/merchant-management/components/merchant-columns';
import { ShopMobileCard } from '@/features/merchant-management/components/ShopMobileCard';
import { ShopRowActions } from '@/features/merchant-management/components/ShopRowActions';
import {
  cityFilterToParam,
  ShopCityFilter,
  SHOP_CITY_ALL_FILTER,
  ShopStatusFilter,
  SHOP_STATUS_ALL_FILTER,
  statusFilterToParam,
} from '@/features/merchant-management/components/ShopFilters';
import { useShopListQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import type { ShopListParams } from '@/features/merchant-management/types/shop';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';

const DEFAULT_PAGE_SIZE = 20;

function ShopTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ShopTable(): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(SHOP_STATUS_ALL_FILTER);
  const [cityFilter, setCityFilter] = useState(SHOP_CITY_ALL_FILTER);
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleStatusFilterChange = (value: string): void => {
    setStatusFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleCityFilterChange = (value: string): void => {
    setCityFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSortingChange: typeof setSorting = (updater) => {
    setSorting(updater);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): ShopListParams => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
      status: statusFilterToParam(statusFilter),
      city: cityFilterToParam(cityFilter),
      sortBy: sort?.id as ShopListParams['sortBy'],
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
    cityFilter,
    sorting,
  ]);

  const columns = useShopColumns(queryParams);
  const { data, isPending, isError, isFetching } = useShopListQuery(queryParams);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
      emptyMessage={t('empty.list')}
      skeleton={<ShopTableSkeleton />}
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
          filterSlot={
            <div className="flex flex-col gap-2 sm:flex-row">
              <ShopStatusFilter value={statusFilter} onChange={handleStatusFilterChange} />
              <ShopCityFilter value={cityFilter} onChange={handleCityFilterChange} />
            </div>
          }
          sorting={sorting}
          onSortingChange={handleSortingChange}
          manualSorting
          isLoading={isFetching && !isPending}
          searchPlaceholder={t('list.searchPlaceholder')}
          getRowId={(row) => row.id}
          renderMobileCard={(row) => (
            <ShopMobileCard
              shop={row}
              actions={<ShopRowActions shop={row} listParams={queryParams} />}
            />
          )}
          paginationLabels={{
            previous: t('pagination.previous'),
            next: t('pagination.next'),
            page: (current, total) => t('pagination.page', { current, total }),
            rowsPerPage: t('pagination.rowsPerPage'),
          }}
        />
      ) : null}
    </QuerySection>
  );
}
