import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { ShopRowActions } from '@/features/merchant-management/components/ShopRowActions';
import { ShopStatusBadge } from '@/features/merchant-management/components/ShopStatusBadge';
import type { ShopListItem, ShopListParams } from '@/features/merchant-management/types/shop';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { StarRating } from '@/shared/components/rating/StarRating';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopColumns(listParams: ShopListParams): ColumnDef<ShopListItem, unknown>[] {
  const { t } = useTranslation('merchant-management');

  return useMemo(
    () => [
      {
        accessorKey: 'shopName',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.shopName')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <TruncatedText text={row.original.shopName} className="font-medium" />
            {row.original.isFeatured ? (
              <Badge variant="secondary" className="shrink-0">
                {t('list.featured')}
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'ownerName',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.owner')} />,
        cell: ({ row }) => <TruncatedText text={row.original.ownerName} />,
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.rating')} />,
        cell: ({ row }) => <StarRating value={row.original.rating} size="sm" showValue />,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.status')} />,
        cell: ({ row }) => <ShopStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'city',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.city')} />,
        cell: ({ row }) => row.original.city,
      },
      {
        accessorKey: 'activeServices',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.activeServices')} />
        ),
        cell: ({ row }) => row.original.activeServices,
      },
      {
        accessorKey: 'activeStaff',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.activeStaff')} />
        ),
        cell: ({ row }) => row.original.activeStaff,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => (
          <ShopRowActions shop={row.original} listParams={listParams} />
        ),
        enableSorting: false,
      },
    ],
    [t, listParams],
  );
}
