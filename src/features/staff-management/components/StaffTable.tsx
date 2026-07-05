import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useStaffColumns } from '@/features/staff-management/components/staff-columns';
import { StaffFormSheet } from '@/features/staff-management/components/StaffFormSheet';
import {
  STAFF_AVAILABILITY_ALL_FILTER,
  STAFF_ROLE_ALL_FILTER,
  STAFF_SHOP_ALL_FILTER,
  STAFF_STATUS_ALL_FILTER,
  StaffFilters,
  availabilityFilterToParam,
  roleFilterToParam,
  shopFilterToParam,
  statusFilterToParam,
} from '@/features/staff-management/components/StaffFilters';
import { StaffMobileCard } from '@/features/staff-management/components/StaffMobileCard';
import { StaffRowActions } from '@/features/staff-management/components/StaffRowActions';
import { useStaffListQuery } from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffListParams } from '@/features/staff-management/types/staff';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';

const DEFAULT_PAGE_SIZE = 20;

function StaffTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function StaffTable(): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const columns = useStaffColumns();
  const ability = usePermissions();
  const { isAdmin } = useScope();
  const canManage = ability.can('manage', PERMISSIONS.staff.manage);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [shopFilter, setShopFilter] = useState(STAFF_SHOP_ALL_FILTER);
  const [roleFilter, setRoleFilter] = useState(STAFF_ROLE_ALL_FILTER);
  const [statusFilter, setStatusFilter] = useState(STAFF_STATUS_ALL_FILTER);
  const [availabilityFilter, setAvailabilityFilter] = useState(STAFF_AVAILABILITY_ALL_FILTER);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const resetPage = (): void => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): Omit<StaffListParams, 'merchantId'> & { merchantId?: string | null } => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch.trim() || undefined,
      role: roleFilterToParam(roleFilter),
      status: statusFilterToParam(statusFilter),
      availability: availabilityFilterToParam(availabilityFilter),
      merchantId: isAdmin ? shopFilterToParam(shopFilter) : undefined,
      sortBy: sort?.id as StaffListParams['sortBy'],
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    shopFilter,
    roleFilter,
    statusFilter,
    availabilityFilter,
    isAdmin,
    sorting,
  ]);

  const { data, isPending, isError, isFetching } = useStaffListQuery(queryParams);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {canManage ? (
          <Button onClick={() => setCreateOpen(true)}>{t('list.addStaff')}</Button>
        ) : (
          <span />
        )}
      </div>

      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
        emptyMessage={t('empty.list')}
        skeleton={<StaffTableSkeleton />}
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
            searchPlaceholder={t('list.searchPlaceholder')}
            getRowId={(row) => row.id}
            filterSlot={
              <StaffFilters
                shop={isAdmin ? shopFilter : STAFF_SHOP_ALL_FILTER}
                role={roleFilter}
                status={statusFilter}
                availability={availabilityFilter}
                showShopFilter={isAdmin}
                onShopChange={(value) => {
                  setShopFilter(value);
                  resetPage();
                }}
                onRoleChange={(value) => {
                  setRoleFilter(value);
                  resetPage();
                }}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  resetPage();
                }}
                onAvailabilityChange={(value) => {
                  setAvailabilityFilter(value);
                  resetPage();
                }}
              />
            }
            renderMobileCard={(row) => (
              <StaffMobileCard staff={row} actions={<StaffRowActions staff={row} />} />
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

      <StaffFormSheet mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
