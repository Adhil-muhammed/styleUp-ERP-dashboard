import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerColumns } from '@/features/user-management/components/customer-columns';
import { CustomerMobileCard } from '@/features/user-management/components/CustomerMobileCard';
import { CustomerRowActions } from '@/features/user-management/components/CustomerRowActions';
import {
  CUSTOMER_STATUS_ALL_FILTER,
  CustomerStatusFilter,
  statusFilterToParam,
} from '@/features/user-management/components/CustomerStatusFilter';
import { useCustomerListQuery } from '@/features/user-management/hooks/use-user-management-queries';
import type { CustomerListParams } from '@/features/user-management/types/customer';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';

const DEFAULT_PAGE_SIZE = 20;

function CustomerTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function CustomerTable(): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerColumns();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(CUSTOMER_STATUS_ALL_FILTER);
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

  const handleSortingChange: typeof setSorting = (updater) => {
    setSorting(updater);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): CustomerListParams => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
      status: statusFilterToParam(statusFilter),
      sortBy: sort?.id as CustomerListParams['sortBy'],
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, statusFilter, sorting]);

  const { data, isPending, isError, isFetching } = useCustomerListQuery(queryParams);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
      emptyMessage={t('empty.list')}
      skeleton={<CustomerTableSkeleton />}
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
            <CustomerStatusFilter value={statusFilter} onChange={handleStatusFilterChange} />
          }
          sorting={sorting}
          onSortingChange={handleSortingChange}
          manualSorting
          isLoading={isFetching && !isPending}
          searchPlaceholder={t('list.searchPlaceholder')}
          getRowId={(row) => row.id}
          renderMobileCard={(row) => (
            <CustomerMobileCard
              customer={row}
              actions={<CustomerRowActions customer={row} />}
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
