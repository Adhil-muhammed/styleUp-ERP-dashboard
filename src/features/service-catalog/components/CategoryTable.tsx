import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCategoryColumns } from '@/features/service-catalog/components/category-columns';
import { CategoryFormSheet } from '@/features/service-catalog/components/CategoryFormSheet';
import {
  CATEGORY_STATUS_ALL_FILTER,
  CategoryFilters,
  categoryStatusFilterToParam,
} from '@/features/service-catalog/components/CategoryFilters';
import { CategoryMobileCard } from '@/features/service-catalog/components/CategoryMobileCard';
import { CategoryRowActions } from '@/features/service-catalog/components/CategoryRowActions';
import { useCategoryListQuery } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import type { ServiceCategoryListParams } from '@/features/service-catalog/types/category';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { usePermissions } from '@/shared/hooks/use-permissions';

const DEFAULT_PAGE_SIZE = 20;

function CategoryTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function CategoryTable(): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const columns = useCategoryColumns();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.services.manage);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(CATEGORY_STATUS_ALL_FILTER);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const resetPage = (): void => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): ServiceCategoryListParams => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
      status: categoryStatusFilterToParam(statusFilter),
      sortBy: sort?.id as ServiceCategoryListParams['sortBy'],
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
    sorting,
  ]);

  const { data, isPending, isError, isFetching } = useCategoryListQuery(queryParams);

  return (
    <>
      {canManage ? (
        <div className="mb-4">
          <Button onClick={() => setCreateOpen(true)}>{t('list.addCategory')}</Button>
        </div>
      ) : null}

      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
        emptyMessage={t('empty.categories')}
        skeleton={<CategoryTableSkeleton />}
      >
        {data ? (
          <DataTable
            columns={columns}
            data={data.data}
            rowCount={data.total}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={(updater) => {
              setSorting(updater);
              resetPage();
            }}
            globalFilter={search}
            onGlobalFilterChange={(value) => {
              setSearch(value);
              resetPage();
            }}
            isLoading={isFetching && !isPending}
            searchPlaceholder={t('list.searchCategoriesPlaceholder')}
            getRowId={(row) => row.id}
            filterSlot={
              <CategoryFilters
                status={statusFilter}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  resetPage();
                }}
              />
            }
            renderMobileCard={(row) => (
              <CategoryMobileCard
                category={row}
                actions={<CategoryRowActions category={row} />}
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

      <CategoryFormSheet mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
