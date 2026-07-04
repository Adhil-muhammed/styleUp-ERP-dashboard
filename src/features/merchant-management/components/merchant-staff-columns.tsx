import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { ShopStaffMember } from '@/features/merchant-management/types/shop-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopStaffColumns(): ColumnDef<ShopStaffMember, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'name', header: t('staff.columns.name'), cell: ({ row }) => <TruncatedText text={row.original.name} className="font-medium" /> },
      { accessorKey: 'role', header: t('staff.columns.role'), cell: ({ row }) => row.original.role },
      { accessorKey: 'phone', header: t('staff.columns.phone'), cell: ({ row }) => row.original.phone },
      { accessorKey: 'isActive', header: t('staff.columns.status'), cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? t('staff.active') : t('staff.inactive')}</Badge> },
    ],
    [t],
  );
}
