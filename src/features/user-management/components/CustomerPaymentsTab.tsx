import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerPaymentColumns } from '@/features/user-management/components/customer-payment-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerPaymentsQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { Badge } from '@/shared/components/ui/badge';

type CustomerPaymentsTabProps = {
  customerId: string;
};

export function CustomerPaymentsTab({ customerId }: CustomerPaymentsTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerPaymentColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerPaymentsQuery(customerId, params);

  return (
    <CustomerTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.payments')}
      searchPlaceholder={t('payments.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{formatInr(row.amount)}</span>
            <Badge variant="secondary">{row.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{row.method}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.paidAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
      )}
    />
  );
}
