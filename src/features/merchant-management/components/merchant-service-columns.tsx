import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { formatInr } from '@/features/dashboard/lib/formatters';
import type { ShopService } from '@/features/merchant-management/types/shop-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopServiceColumns(): ColumnDef<ShopService, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'name', header: t('services.columns.name'), cell: ({ row }) => <TruncatedText text={row.original.name} className="font-medium" /> },
      { accessorKey: 'category', header: t('services.columns.category'), cell: ({ row }) => row.original.category },
      { accessorKey: 'durationMinutes', header: t('services.columns.duration'), cell: ({ row }) => `${row.original.durationMinutes} min` },
      { accessorKey: 'price', header: t('services.columns.price'), cell: ({ row }) => formatInr(row.original.price) },
      { accessorKey: 'isActive', header: t('services.columns.status'), cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? t('services.active') : t('services.inactive')}</Badge> },
    ],
    [t],
  );
}
