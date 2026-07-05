import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { BookingPaymentStatusBadge } from '@/features/booking-management/components/BookingPaymentStatusBadge';
import { BookingRowActions } from '@/features/booking-management/components/BookingRowActions';
import { BookingStatusBadge } from '@/features/booking-management/components/BookingStatusBadge';
import type { BookingListItem } from '@/features/booking-management/types/booking';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

type UseBookingColumnsOptions = {
  onViewDetails: (booking: BookingListItem) => void;
};

export function useBookingColumns({
  onViewDetails,
}: UseBookingColumnsOptions): ColumnDef<BookingListItem, unknown>[] {
  const { t } = useTranslation('booking-management');

  return useMemo(
    () => [
      {
        accessorKey: 'customerName',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('list.customer')} />
        ),
        cell: ({ row }) => (
          <TruncatedText text={row.original.customerName} className="font-medium" />
        ),
      },
      {
        accessorKey: 'shopName',
        header: ({ column }) => <SortableHeader column={column} label={t('list.shop')} />,
        cell: ({ row }) => <TruncatedText text={row.original.shopName} />,
      },
      {
        accessorKey: 'staffName',
        header: t('list.staff'),
        cell: ({ row }) => <TruncatedText text={row.original.staffName} />,
        enableSorting: false,
      },
      {
        id: 'serviceOrPackage',
        header: t('list.serviceOrPackage'),
        cell: ({ row }) => (
          <TruncatedText
            text={
              row.original.kind === 'package' && row.original.packageName
                ? row.original.packageName
                : row.original.serviceName
            }
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'scheduledAt',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('list.dateTime')} />
        ),
        cell: ({ row }) => format(new Date(row.original.scheduledAt), 'dd MMM yyyy, HH:mm'),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column} label={t('list.status')} />,
        cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'paymentStatus',
        header: t('list.paymentStatus'),
        cell: ({ row }) => <BookingPaymentStatusBadge status={row.original.paymentStatus} />,
        enableSorting: false,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => <SortableHeader column={column} label={t('list.amount')} />,
        cell: ({ row }) => formatInr(row.original.amount),
      },
      {
        id: 'actions',
        header: t('list.actions'),
        cell: ({ row }) => (
          <BookingRowActions booking={row.original} onViewDetails={onViewDetails} />
        ),
        enableSorting: false,
      },
    ],
    [onViewDetails, t],
  );
}
