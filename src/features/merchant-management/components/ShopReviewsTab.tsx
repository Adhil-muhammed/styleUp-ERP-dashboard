import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopReviewColumns } from '@/features/merchant-management/components/merchant-review-columns';
import {
  MerchantTabTable,
  useMerchantTabQueryParams,
} from '@/features/merchant-management/components/MerchantTabTable';
import { useShopReviewsQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { StarRating } from '@/shared/components/rating/StarRating';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function ShopReviewsTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const columns = useShopReviewColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useMerchantTabQueryParams();
  const { data, isPending, isError, isFetching } = useShopReviewsQuery(merchantId, params);

  return (
    <MerchantTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.reviews')}
      searchPlaceholder={t('reviews.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <TruncatedText text={row.customerName} className="font-medium" />
            <StarRating value={row.rating} size="sm" />
          </div>
          <TruncatedText text={row.comment} className="text-sm text-muted-foreground" lines={2} />
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.createdAt), 'dd MMM yyyy')}
          </p>
        </div>
      )}
    />
  );
}
