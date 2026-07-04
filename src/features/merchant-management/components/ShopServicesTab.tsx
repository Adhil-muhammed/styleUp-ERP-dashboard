import { formatInr } from '@/features/dashboard/lib/formatters';
import { Link } from 'react-router-dom';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopServiceColumns } from '@/features/merchant-management/components/merchant-service-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopServicesQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { ROUTES } from '@/shared/config/routes';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopServicesTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopServiceColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopServicesQuery(merchantId, params);

  return (
    <div className="space-y-3">
      <Link to={ROUTES.services} className="text-sm text-primary hover:underline">
        {t('services.viewCatalog')}
      </Link>
      <MerchantTabTable
        columns={columns}
        data={data}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
        emptyMessage={t('empty.services')}
        searchPlaceholder={t('services.searchPlaceholder')}
        pagination={pagination}
        onPaginationChange={setPagination}
        search={search}
        onSearchChange={handleSearchChange}
        renderMobileCard={(row) => (
          <div className="space-y-1">
            <TruncatedText text={row.name} className="font-medium" />
            <p className="text-sm text-muted-foreground">{row.category}</p>
            <div className="flex justify-between text-sm">
              <Badge variant={row.isActive ? 'default' : 'secondary'}>
                {row.isActive ? t('services.active') : t('services.inactive')}
              </Badge>
              <span>{formatInr(row.price)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
