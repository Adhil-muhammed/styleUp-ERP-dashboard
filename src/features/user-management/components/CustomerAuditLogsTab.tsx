import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerAuditLogColumns } from '@/features/user-management/components/customer-audit-log-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerAuditLogsQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type CustomerAuditLogsTabProps = {
  customerId: string;
};

export function CustomerAuditLogsTab({
  customerId,
}: CustomerAuditLogsTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerAuditLogColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerAuditLogsQuery(customerId, params);

  return (
    <CustomerTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.auditLogs')}
      searchPlaceholder={t('auditLogs.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <TruncatedText text={row.action} className="font-medium" />
          <p className="text-sm text-muted-foreground">{row.actor}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.createdAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
      )}
    />
  );
}
