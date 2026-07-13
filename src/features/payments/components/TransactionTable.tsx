import type { SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  PAYMENT_DATE_PRESET_ALL,
  PAYMENT_METHOD_ALL_FILTER,
  PAYMENT_SHOP_ALL_FILTER,
  PAYMENT_STATUS_ALL_FILTER,
  PaymentFilters,
  datePresetToRange,
  methodFilterToParam,
  shopFilterToParam,
  statusFilterToParam,
} from '@/features/payments/components/PaymentFilters';
import { PaymentMobileCard } from '@/features/payments/components/PaymentMobileCard';
import { usePaymentColumns } from '@/features/payments/components/payment-columns';
import { RefundModal } from '@/features/payments/components/RefundModal';
import { TransactionDetailSheet } from '@/features/payments/components/TransactionDetailSheet';
import {
  useExportPaymentsMutation,
  usePaymentListQuery,
} from '@/features/payments/hooks/use-payments-queries';
import type { PaymentListItem, PaymentListParams } from '@/features/payments/types/payment';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { ExportButton } from '@/shared/components/export/ExportButton';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useScope } from '@/shared/hooks/use-scope';

const DEFAULT_LIMIT = 20;

function TransactionTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full sm:max-w-xs" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function TransactionTable(): React.ReactElement {
  const { t } = useTranslation('payments');
  const { merchantId } = useScope();

  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(PAYMENT_STATUS_ALL_FILTER);
  const [methodFilter, setMethodFilter] = useState(PAYMENT_METHOD_ALL_FILTER);
  const [shopFilter, setShopFilter] = useState(PAYMENT_SHOP_ALL_FILTER);
  const [datePreset, setDatePreset] = useState(PAYMENT_DATE_PRESET_ALL);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [refundPayment, setRefundPayment] = useState<PaymentListItem | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const resetCursor = (): void => {
    setCursor(null);
    setCursorHistory([]);
  };

  useEffect(() => {
    resetCursor();
  }, [
    debouncedSearch,
    statusFilter,
    methodFilter,
    shopFilter,
    datePreset,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sorting,
    limit,
    merchantId,
  ]);

  const queryParams = useMemo((): PaymentListParams => {
    const sort = sorting[0];
    const dateRange = datePresetToRange(datePreset, dateFrom, dateTo);
    return {
      cursor,
      limit,
      merchantId,
      search: debouncedSearch.trim() || undefined,
      status: statusFilterToParam(statusFilter),
      method: methodFilterToParam(methodFilter),
      shopId: shopFilterToParam(shopFilter),
      ...dateRange,
      amountMinPaise: amountMin ? Number(amountMin) * 100 : undefined,
      amountMaxPaise: amountMax ? Number(amountMax) * 100 : undefined,
      sortBy: (sort?.id as PaymentListParams['sortBy']) ?? 'createdAt',
      sortOrder: sort?.desc ? 'desc' : 'asc',
    };
  }, [
    cursor,
    limit,
    merchantId,
    debouncedSearch,
    statusFilter,
    methodFilter,
    shopFilter,
    datePreset,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sorting,
  ]);

  const { data, isPending, isError, isFetching } = usePaymentListQuery(queryParams);
  const exportMutation = useExportPaymentsMutation();

  const handleViewDetails = (payment: PaymentListItem): void => {
    setSelectedPaymentId(payment.id);
    setDetailsOpen(true);
  };

  const columns = usePaymentColumns({
    onViewDetails: handleViewDetails,
    onRefund: setRefundPayment,
  });

  const handleNext = (): void => {
    if (!data?.page.nextCursor) {
      return;
    }
    setCursorHistory((current) => [...current, cursor ?? '']);
    setCursor(data.page.nextCursor);
  };

  const handlePrevious = (): void => {
    setCursorHistory((current) => {
      const next = [...current];
      const previousCursor = next.pop() ?? null;
      setCursor(previousCursor === '' ? null : previousCursor);
      return next;
    });
  };

  const exportParams = useMemo(
    (): PaymentListParams => ({
      ...queryParams,
      cursor: null,
      limit: undefined,
    }),
    [queryParams],
  );

  return (
    <>
      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.items.length === 0 && !isFetching)}
        emptyMessage={t('empty.transactions')}
        skeleton={<TransactionTableSkeleton />}
      >
        {data ? (
          <DataTable
            columns={columns}
            data={data.items}
            rowCount={data.items.length}
            pagination={{ pageIndex: 0, pageSize: limit }}
            onPaginationChange={() => undefined}
            globalFilter={search}
            onGlobalFilterChange={setSearch}
            searchPlaceholder={t('list.searchPlaceholder')}
            filterSlot={
              <PaymentFilters
                status={statusFilter}
                method={methodFilter}
                shop={shopFilter}
                datePreset={datePreset}
                dateFrom={dateFrom}
                dateTo={dateTo}
                amountMin={amountMin}
                amountMax={amountMax}
                onStatusChange={setStatusFilter}
                onMethodChange={setMethodFilter}
                onShopChange={setShopFilter}
                onDatePresetChange={setDatePreset}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onAmountMinChange={setAmountMin}
                onAmountMaxChange={setAmountMax}
              />
            }
            toolbarEndSlot={
              <ExportButton
                label={t('export.label')}
                onExport={() => exportMutation.mutate(exportParams)}
                isPending={exportMutation.isPending}
              />
            }
            isLoading={isFetching && !isPending}
            getRowId={(row) => row.id}
            renderMobileCard={(row) => <PaymentMobileCard payment={row} />}
            sorting={sorting}
            onSortingChange={setSorting}
            manualSorting
            paginationMode="cursor"
            cursorPagination={{
              hasMore: data.page.hasMore,
              canPrevious: cursorHistory.length > 0,
              onNext: handleNext,
              onPrevious: handlePrevious,
              limit,
              onLimitChange: setLimit,
              labels: {
                previous: t('list.previous'),
                next: t('list.next'),
                rowsPerPage: t('list.rowsPerPage'),
              },
            }}
            paginationLabels={{
              previous: t('list.previous'),
              next: t('list.next'),
              page: () => '',
              rowsPerPage: t('list.rowsPerPage'),
            }}
            onRowClick={handleViewDetails}
          />
        ) : null}
      </QuerySection>

      <TransactionDetailSheet
        paymentId={selectedPaymentId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onRefund={(payment) => {
          setRefundPayment(payment);
          setDetailsOpen(false);
        }}
      />

      <RefundModal
        payment={refundPayment}
        listParams={queryParams}
        onClose={() => setRefundPayment(null)}
      />
    </>
  );
}
