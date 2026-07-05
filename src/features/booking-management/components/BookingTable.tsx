import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useBookingColumns } from '@/features/booking-management/components/booking-columns';
import { BookingDetailsSheet } from '@/features/booking-management/components/BookingDetailsSheet';
import {
  BOOKING_PAYMENT_ALL_FILTER,
  BOOKING_SHOP_ALL_FILTER,
  BOOKING_STAFF_ALL_FILTER,
  BOOKING_STATUS_ALL_FILTER,
  BookingFilters,
  paymentFilterToParam,
  shopFilterToParam,
  staffFilterToParam,
  statusFilterToParam,
} from '@/features/booking-management/components/BookingFilters';
import { BookingMobileCard } from '@/features/booking-management/components/BookingMobileCard';
import { useBookingListQuery } from '@/features/booking-management/hooks/use-booking-management-queries';
import type { BookingListItem, BookingListParams } from '@/features/booking-management/types/booking';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useScope } from '@/shared/hooks/use-scope';

const DEFAULT_PAGE_SIZE = 20;

function BookingTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function BookingTable(): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { merchantId } = useScope();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(BOOKING_STATUS_ALL_FILTER);
  const [shopFilter, setShopFilter] = useState(BOOKING_SHOP_ALL_FILTER);
  const [staffFilter, setStaffFilter] = useState(BOOKING_STAFF_ALL_FILTER);
  const [paymentFilter, setPaymentFilter] = useState(BOOKING_PAYMENT_ALL_FILTER);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'scheduledAt', desc: true }]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedCustomerSearch = useDebounce(customerSearch, 300);

  const handleViewDetails = (booking: BookingListItem): void => {
    setSelectedBookingId(booking.id);
    setDetailsOpen(true);
  };

  const columns = useBookingColumns({ onViewDetails: handleViewDetails });

  const resetPage = (): void => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const queryParams = useMemo((): BookingListParams => {
    const sort = sorting[0];
    const statusParams = statusFilterToParam(statusFilter);
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      merchantId,
      search: debouncedSearch.trim() || undefined,
      ...statusParams,
      shopId: shopFilterToParam(shopFilter),
      staffId: staffFilterToParam(staffFilter),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      customerSearch: debouncedCustomerSearch.trim() || undefined,
      paymentStatus: paymentFilterToParam(paymentFilter),
      sortBy: (sort?.id as BookingListParams['sortBy']) ?? 'scheduledAt',
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    merchantId,
    debouncedSearch,
    statusFilter,
    shopFilter,
    staffFilter,
    dateFrom,
    dateTo,
    debouncedCustomerSearch,
    paymentFilter,
    sorting,
  ]);

  const { data, isPending, isError, isFetching } = useBookingListQuery(queryParams);

  return (
    <>
      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.data.length === 0 && !isFetching)}
        emptyMessage={t('empty.list')}
        skeleton={<BookingTableSkeleton />}
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
            searchPlaceholder={t('list.searchPlaceholder')}
            getRowId={(row) => row.id}
            onRowClick={handleViewDetails}
            filterSlot={
              <BookingFilters
                status={statusFilter}
                shop={shopFilter}
                staff={staffFilter}
                paymentStatus={paymentFilter}
                dateFrom={dateFrom}
                dateTo={dateTo}
                customerSearch={customerSearch}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  resetPage();
                }}
                onShopChange={(value) => {
                  setShopFilter(value);
                  setStaffFilter(BOOKING_STAFF_ALL_FILTER);
                  resetPage();
                }}
                onStaffChange={(value) => {
                  setStaffFilter(value);
                  resetPage();
                }}
                onPaymentStatusChange={(value) => {
                  setPaymentFilter(value);
                  resetPage();
                }}
                onDateFromChange={(value) => {
                  setDateFrom(value);
                  resetPage();
                }}
                onDateToChange={(value) => {
                  setDateTo(value);
                  resetPage();
                }}
                onCustomerSearchChange={(value) => {
                  setCustomerSearch(value);
                  resetPage();
                }}
              />
            }
            renderMobileCard={(row) => (
              <BookingMobileCard booking={row} onViewDetails={handleViewDetails} />
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

      <BookingDetailsSheet
        bookingId={selectedBookingId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
