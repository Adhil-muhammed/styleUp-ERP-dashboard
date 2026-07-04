import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerNotificationColumns } from '@/features/user-management/components/customer-notification-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerNotificationsQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type CustomerNotificationsTabProps = {
  customerId: string;
};

export function CustomerNotificationsTab({
  customerId,
}: CustomerNotificationsTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerNotificationColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerNotificationsQuery(
    customerId,
    params,
  );

  return (
    <CustomerTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.notifications')}
      searchPlaceholder={t('notifications.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <TruncatedText text={row.title} className="font-medium" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{row.channel}</span>
            <Badge variant="secondary">{row.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.sentAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
      )}
    />
  );
}
