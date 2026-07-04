import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { formatInr } from '@/features/dashboard/lib/formatters';
import type { ShopBooking } from '@/features/merchant-management/types/shop-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useShopBookingColumns(): ColumnDef<ShopBooking, unknown>[] {
  const { t } = useTranslation('merchant-management');
  return useMemo(
    () => [
      { accessorKey: 'customerName', header: t('bookings.columns.customer'), cell: ({ row }) => <TruncatedText text={row.original.customerName} className="font-medium" /> },
      { accessorKey: 'serviceName', header: t('bookings.columns.service'), cell: ({ row }) => <TruncatedText text={row.original.serviceName} /> },
      { accessorKey: 'status', header: t('bookings.columns.status'), cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge> },
      { accessorKey: 'scheduledAt', header: t('bookings.columns.scheduled'), cell: ({ row }) => format(new Date(row.original.scheduledAt), 'dd MMM yyyy, HH:mm') },
      { accessorKey: 'amount', header: t('bookings.columns.amount'), cell: ({ row }) => formatInr(row.original.amount) },
    ],
    [t],
  );
}
