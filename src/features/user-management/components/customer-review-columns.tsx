import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { CustomerReview } from '@/features/user-management/types/customer-tabs';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerReviewColumns(): ColumnDef<CustomerReview, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'shopName',
        header: t('reviews.columns.shop'),
        cell: ({ row }) => <TruncatedText text={row.original.shopName} className="font-medium" />,
      },
      {
        accessorKey: 'rating',
        header: t('reviews.columns.rating'),
        cell: ({ row }) => `${row.original.rating}/5`,
      },
      {
        accessorKey: 'comment',
        header: t('reviews.columns.comment'),
        cell: ({ row }) => <TruncatedText text={row.original.comment} lines={2} />,
      },
      {
        accessorKey: 'createdAt',
        header: t('reviews.columns.date'),
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy'),
      },
    ],
    [t],
  );
}
