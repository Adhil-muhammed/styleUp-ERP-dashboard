import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerReviewColumns } from '@/features/user-management/components/customer-review-columns';
import {
  CustomerTabTable,
  useCustomerTabQueryParams,
} from '@/features/user-management/components/CustomerTabTable';
import { useCustomerReviewsQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type CustomerReviewsTabProps = {
  customerId: string;
};

export function CustomerReviewsTab({ customerId }: CustomerReviewsTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const columns = useCustomerReviewColumns();
  const { params, pagination, setPagination, search, handleSearchChange } =
    useCustomerTabQueryParams();
  const { data, isPending, isError, isFetching } = useCustomerReviewsQuery(customerId, params);

  return (
    <CustomerTabTable
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
            <TruncatedText text={row.shopName} className="font-medium" />
            <span className="text-sm">{row.rating}/5</span>
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
