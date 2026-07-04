import { formatInr } from '@/features/dashboard/lib/formatters';
import { Link } from 'react-router-dom';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopPackageColumns } from '@/features/merchant-management/components/merchant-package-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopPackagesQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { ROUTES } from '@/shared/config/routes';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopPackagesTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopPackageColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopPackagesQuery(merchantId, params);

  return (
    <div className="space-y-3">
      <Link to={ROUTES.packages} className="text-sm text-primary hover:underline">
        {t('packages.viewCatalog')}
      </Link>
      <MerchantTabTable
        columns={columns}
        data={data}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
        emptyMessage={t('empty.packages')}
        searchPlaceholder={t('packages.searchPlaceholder')}
        pagination={pagination}
        onPaginationChange={setPagination}
        search={search}
        onSearchChange={handleSearchChange}
        renderMobileCard={(row) => (
          <div className="space-y-1">
            <TruncatedText text={row.name} className="font-medium" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{row.servicesCount} services</span>
              <span>{formatInr(row.price)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
