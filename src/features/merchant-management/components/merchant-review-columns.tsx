import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { ShopReview } from '@/features/merchant-management/types/shop-tabs';
import { StarRating } from '@/shared/components/rating/StarRating';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopReviewColumns(): ColumnDef<ShopReview, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'customerName', header: t('reviews.columns.customer'), cell: ({ row }) => <TruncatedText text={row.original.customerName} className="font-medium" /> },
      { accessorKey: 'rating', header: t('reviews.columns.rating'), cell: ({ row }) => <StarRating value={row.original.rating} size="sm" /> },
      { accessorKey: 'comment', header: t('reviews.columns.comment'), cell: ({ row }) => <TruncatedText text={row.original.comment} lines={2} /> },
      { accessorKey: 'createdAt', header: t('reviews.columns.date'), cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy') },
    ],
    [t],
  );
}
