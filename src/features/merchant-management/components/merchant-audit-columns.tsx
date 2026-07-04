import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { ShopAuditLog } from '@/features/merchant-management/types/shop-tabs';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopAuditColumns(): ColumnDef<ShopAuditLog, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'action', header: t('auditHistory.columns.action'), cell: ({ row }) => <TruncatedText text={row.original.action} className="font-medium" /> },
      { accessorKey: 'actor', header: t('auditHistory.columns.actor'), cell: ({ row }) => row.original.actor },
      { accessorKey: 'createdAt', header: t('auditHistory.columns.date'), cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy, HH:mm') },
    ],
    [t],
  );
}
