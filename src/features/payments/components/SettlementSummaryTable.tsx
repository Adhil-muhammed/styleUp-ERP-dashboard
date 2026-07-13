import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  PAYMENT_SHOP_ALL_FILTER,
  getDefaultMonthRange,
  shopFilterToParam,
} from '@/features/payments/components/PaymentFilters';
import { useSettlementColumns } from '@/features/payments/components/settlement-columns';
import { useSettlementListQuery } from '@/features/payments/hooks/use-payments-queries';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useScope } from '@/shared/hooks/use-scope';
import { table } from '@/theme/responsive';

function SettlementTableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function SettlementSummaryTable(): React.ReactElement {
  const { t } = useTranslation('payments');
  const { merchantId } = useScope();
  const defaultRange = getDefaultMonthRange();

  const [shopFilter, setShopFilter] = useState(PAYMENT_SHOP_ALL_FILTER);
  const [periodStart, setPeriodStart] = useState(defaultRange.periodStart);
  const [periodEnd, setPeriodEnd] = useState(defaultRange.periodEnd);

  const queryParams = useMemo(
    () => ({
      merchantId,
      shopId: shopFilterToParam(shopFilter),
      periodStart: periodStart || undefined,
      periodEnd: periodEnd || undefined,
    }),
    [merchantId, shopFilter, periodStart, periodEnd],
  );

  const { data, isPending, isError } = useSettlementListQuery(queryParams);
  const columns = useSettlementColumns();

  const tableInstance = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <section className="space-y-3" data-testid="settlement-summary-table">
      <h2 className="text-base font-semibold">{t('settlement.title')}</h2>

      <div className={table.filterGrid}>
        <Select value={shopFilter} onValueChange={setShopFilter}>
          <SelectTrigger size="sm">
            <SelectValue placeholder={t('filters.shop')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PAYMENT_SHOP_ALL_FILTER}>{t('filters.allShops')}</SelectItem>
            {shopsFixture.map((shop) => (
              <SelectItem key={shop.id} value={shop.id}>
                {shop.shopName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={periodStart}
          onChange={(event) => setPeriodStart(event.target.value)}
          aria-label={t('filters.dateFrom')}
        />
        <Input
          type="date"
          value={periodEnd}
          onChange={(event) => setPeriodEnd(event.target.value)}
          aria-label={t('filters.dateTo')}
        />
      </div>

      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.length === 0)}
        emptyMessage={t('empty.settlements')}
        skeleton={<SettlementTableSkeleton />}
      >
        {data ? (
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full caption-bottom text-sm">
              <thead>
                {tableInstance.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-10 px-3 text-left align-middle font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {tableInstance.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </QuerySection>
    </section>
  );
}
