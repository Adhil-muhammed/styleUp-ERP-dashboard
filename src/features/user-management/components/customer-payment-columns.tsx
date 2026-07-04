import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { formatInr } from '@/features/dashboard/lib/formatters';
import type { CustomerPayment } from '@/features/user-management/types/customer-tabs';
import { Badge } from '@/shared/components/ui/badge';

export function useCustomerPaymentColumns(): ColumnDef<CustomerPayment, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'amount',
        header: t('payments.columns.amount'),
        cell: ({ row }) => formatInr(row.original.amount),
      },
      {
        accessorKey: 'method',
        header: t('payments.columns.method'),
        cell: ({ row }) => row.original.method,
      },
      {
        accessorKey: 'status',
        header: t('payments.columns.status'),
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: 'paidAt',
        header: t('payments.columns.paidAt'),
        cell: ({ row }) => format(new Date(row.original.paidAt), 'dd MMM yyyy, HH:mm'),
      },
    ],
    [t],
  );
}
