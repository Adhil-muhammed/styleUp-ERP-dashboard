import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerLoyaltyColumns } from '@/features/user-management/components/customer-loyalty-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerLoyaltyQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type CustomerLoyaltyTabProps = {
  customerId: string;
};

export function CustomerLoyaltyTab({ customerId }: CustomerLoyaltyTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerLoyaltyColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerLoyaltyQuery(customerId, params);

  return (
    <CustomerTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.loyalty')}
      searchPlaceholder={t('loyalty.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant={row.type === 'earn' ? 'default' : 'secondary'}>
              {t(`loyalty.type.${row.type}`)}
            </Badge>
            <span className={row.type === 'redeem' ? 'text-destructive' : 'font-medium'}>
              {row.type === 'redeem' ? '-' : '+'}
              {row.points}
            </span>
          </div>
          <TruncatedText text={row.description} className="text-sm text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.createdAt), 'dd MMM yyyy')}
          </p>
        </div>
      )}
    />
  );
}
