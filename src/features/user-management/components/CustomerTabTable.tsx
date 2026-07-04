import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerTabListParams } from '@/features/user-management/types/customer-tabs';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';
import type { PaginatedResponse } from '@/shared/types/common';

export const TAB_PAGE_SIZE = 10;

export function useCustomerTabQueryParams(): {
  params: CustomerTabListParams;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  search: string;
  handleSearchChange: (value: string) => void;
} {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: TAB_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const params = useMemo(
    (): CustomerTabListParams => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
    }),
    [pagination.pageIndex, pagination.pageSize, debouncedSearch],
  );

  return { params, pagination, setPagination, search, handleSearchChange };
}

type CustomerTabTableProps<TData extends { id: string }> = {
  columns: ColumnDef<TData, unknown>[];
  data: PaginatedResponse<TData> | undefined;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  emptyMessage: string;
  searchPlaceholder: string;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  search: string;
  onSearchChange: (value: string) => void;
  renderMobileCard: (row: TData) => ReactNode;
};

function TabTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function CustomerTabTable<TData extends { id: string }>({
  columns,
  data,
  isPending,
  isError,
  isFetching,
  emptyMessage,
  searchPlaceholder,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  renderMobileCard,
}: CustomerTabTableProps<TData>): React.ReactElement {
  const { t } = useTranslation('user-management');

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
      emptyMessage={emptyMessage}
      skeleton={<TabTableSkeleton />}
    >
      {data ? (
        <DataTable
          columns={columns}
          data={data.data}
          rowCount={data.total}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          globalFilter={search}
          onGlobalFilterChange={onSearchChange}
          isLoading={isFetching && !isPending}
          searchPlaceholder={searchPlaceholder}
          getRowId={(row) => row.id}
          renderMobileCard={(row) => (
            <div className="rounded-lg border bg-card p-3">{renderMobileCard(row)}</div>
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
