import { Link } from 'react-router-dom';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopStaffColumns } from '@/features/merchant-management/components/merchant-staff-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopStaffQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { ROUTES } from '@/shared/config/routes';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopStaffTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopStaffColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopStaffQuery(merchantId, params);

  return (
    <div className="space-y-3">
      <Link to={ROUTES.staff} className="text-sm text-primary hover:underline">
        {t('staff.viewAll')}
      </Link>
      <MerchantTabTable
        columns={columns}
        data={data}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
        emptyMessage={t('empty.staff')}
        searchPlaceholder={t('staff.searchPlaceholder')}
        pagination={pagination}
        onPaginationChange={setPagination}
        search={search}
        onSearchChange={handleSearchChange}
        renderMobileCard={(row) => (
          <div className="space-y-1">
            <TruncatedText text={row.name} className="font-medium" />
            <p className="text-sm text-muted-foreground">{row.role}</p>
            <Badge variant={row.isActive ? 'default' : 'secondary'}>
              {row.isActive ? t('staff.active') : t('staff.inactive')}
            </Badge>
          </div>
        )}
      />
    </div>
  );
}
