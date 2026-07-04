import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { CustomerLoyaltyEntry } from '@/features/user-management/types/customer-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerLoyaltyColumns(): ColumnDef<CustomerLoyaltyEntry, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'type',
        header: t('loyalty.columns.type'),
        cell: ({ row }) => (
          <Badge variant={row.original.type === 'earn' ? 'default' : 'secondary'}>
            {t(`loyalty.type.${row.original.type}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'points',
        header: t('loyalty.columns.points'),
        cell: ({ row }) => (
          <span className={row.original.type === 'redeem' ? 'text-destructive' : ''}>
            {row.original.type === 'redeem' ? '-' : '+'}
            {row.original.points}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: t('loyalty.columns.description'),
        cell: ({ row }) => <TruncatedText text={row.original.description} />,
      },
      {
        accessorKey: 'createdAt',
        header: t('loyalty.columns.date'),
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy'),
      },
    ],
    [t],
  );
}
