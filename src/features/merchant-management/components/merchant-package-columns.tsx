import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { formatInr } from '@/features/dashboard/lib/formatters';
import type { ShopPackage } from '@/features/merchant-management/types/shop-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopPackageColumns(): ColumnDef<ShopPackage, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'name', header: t('packages.columns.name'), cell: ({ row }) => <TruncatedText text={row.original.name} className="font-medium" /> },
      { accessorKey: 'servicesCount', header: t('packages.columns.services'), cell: ({ row }) => row.original.servicesCount },
      { accessorKey: 'price', header: t('packages.columns.price'), cell: ({ row }) => formatInr(row.original.price) },
      { accessorKey: 'isActive', header: t('packages.columns.status'), cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? t('packages.active') : t('packages.inactive')}</Badge> },
    ],
    [t],
  );
}
