import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { formatInr } from '@/features/dashboard/lib/formatters';
import { useShopBookingColumns } from '@/features/merchant-management/components/merchant-booking-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopBookingsQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopBookingsTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopBookingColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopBookingsQuery(merchantId, params);

  return (
    <MerchantTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.bookings')}
      searchPlaceholder={t('bookings.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <TruncatedText text={row.customerName} className="font-medium" />
          <TruncatedText text={row.serviceName} className="text-sm text-muted-foreground" />
          <div className="flex justify-between text-sm">
            <Badge variant="secondary">{row.status}</Badge>
            <span>{formatInr(row.amount)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.scheduledAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
      )}
    />
  );
}
