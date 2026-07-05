import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useServiceVariantColumns } from '@/features/service-catalog/components/service-variant-columns';
import { ServiceVariantFormSheet } from '@/features/service-catalog/components/ServiceVariantFormSheet';
import {
  ServiceVariantFilters,
  VARIANT_CATEGORY_ALL_FILTER,
  VARIANT_GENDER_ALL_FILTER,
  VARIANT_STATUS_ALL_FILTER,
  variantCategoryFilterToParam,
  variantGenderFilterToParam,
  variantStatusFilterToParam,
} from '@/features/service-catalog/components/ServiceVariantFilters';
import { ServiceVariantMobileCard } from '@/features/service-catalog/components/ServiceVariantMobileCard';
import { ServiceVariantRowActions } from '@/features/service-catalog/components/ServiceVariantRowActions';
import { useServiceVariantListQuery } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import type { ServiceVariantListParams } from '@/features/service-catalog/types/service-variant';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { usePermissions } from '@/shared/hooks/use-permissions';

const DEFAULT_PAGE_SIZE = 20;

function ServiceVariantTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ServiceVariantTable(): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const columns = useServiceVariantColumns();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.services.manage);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(VARIANT_CATEGORY_ALL_FILTER);
  const [genderFilter, setGenderFilter] = useState(VARIANT_GENDER_ALL_FILTER);
  const [statusFilter, setStatusFilter] = useState(VARIANT_STATUS_ALL_FILTER);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'sortOrder', desc: false }]);
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const resetPage = (): void => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): ServiceVariantListParams => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
      categoryId: variantCategoryFilterToParam(categoryFilter),
      gender: variantGenderFilterToParam(genderFilter),
      status: variantStatusFilterToParam(statusFilter),
      sortBy: (sort?.id as ServiceVariantListParams['sortBy']) ?? 'sortOrder',
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    categoryFilter,
    genderFilter,
    statusFilter,
    sorting,
  ]);

  const { data, isPending, isError, isFetching } = useServiceVariantListQuery(queryParams);

  return (
    <>
      {canManage ? (
        <div className="mb-4">
          <Button onClick={() => setCreateOpen(true)}>{t('list.addVariant')}</Button>
        </div>
      ) : null}

      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
        emptyMessage={t('empty.variants')}
        skeleton={<ServiceVariantTableSkeleton />}
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
            manualSorting
            globalFilter={search}
            onGlobalFilterChange={(value) => {
              setSearch(value);
              resetPage();
            }}
            isLoading={isFetching && !isPending}
            searchPlaceholder={t('list.searchVariantsPlaceholder')}
            getRowId={(row) => row.id}
            filterSlot={
              <ServiceVariantFilters
                category={categoryFilter}
                gender={genderFilter}
                status={statusFilter}
                onCategoryChange={(value) => {
                  setCategoryFilter(value);
                  resetPage();
                }}
                onGenderChange={(value) => {
                  setGenderFilter(value);
                  resetPage();
                }}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  resetPage();
                }}
              />
            }
            renderMobileCard={(row) => (
              <ServiceVariantMobileCard
                variant={row}
                actions={<ServiceVariantRowActions variant={row} />}
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

      <ServiceVariantFormSheet mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
