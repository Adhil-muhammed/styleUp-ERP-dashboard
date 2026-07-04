import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopAuditColumns } from '@/features/merchant-management/components/merchant-audit-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopAuditLogsQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopAuditHistoryTab({
  merchantId,
}: {
  merchantId: string;
}): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopAuditColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopAuditLogsQuery(merchantId, params);

  return (
    <MerchantTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.auditHistory')}
      searchPlaceholder={t('auditHistory.searchPlaceholder')}
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
