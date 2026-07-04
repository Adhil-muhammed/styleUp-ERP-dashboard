import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { CustomerBooking } from '@/features/user-management/types/customer-tabs';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerBookingColumns(): ColumnDef<CustomerBooking, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'shopName',
        header: t('bookings.columns.shop'),
        cell: ({ row }) => <TruncatedText text={row.original.shopName} className="font-medium" />,
      },
      {
        accessorKey: 'serviceName',
        header: t('bookings.columns.service'),
        cell: ({ row }) => <TruncatedText text={row.original.serviceName} />,
      },
      {
        accessorKey: 'status',
        header: t('bookings.columns.status'),
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
      },
      {
        accessorKey: 'scheduledAt',
        header: t('bookings.columns.scheduled'),
        cell: ({ row }) => format(new Date(row.original.scheduledAt), 'dd MMM yyyy, HH:mm'),
      },
      {
        accessorKey: 'amount',
        header: t('bookings.columns.amount'),
        cell: ({ row }) => formatInr(row.original.amount),
      },
    ],
    [t],
  );
}
