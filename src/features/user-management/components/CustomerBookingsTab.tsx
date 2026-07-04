import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerBookingColumns } from '@/features/user-management/components/customer-booking-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerBookingsQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type CustomerBookingsTabProps = {
  customerId: string;
};

export function CustomerBookingsTab({ customerId }: CustomerBookingsTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerBookingColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerBookingsQuery(customerId, params);

  return (
    <CustomerTabTable
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
          <TruncatedText text={row.shopName} className="font-medium" />
          <TruncatedText text={row.serviceName} className="text-sm text-muted-foreground" />
          <div className="flex items-center justify-between text-sm">
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
