import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { PaymentRowActions } from '@/features/payments/components/PaymentRowActions';
import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import type { PaymentListItem } from '@/features/payments/types/payment';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

type UsePaymentColumnsOptions = {
  onViewDetails: (payment: PaymentListItem) => void;
  onRefund: (payment: PaymentListItem) => void;
};

export function usePaymentColumns({
  onViewDetails,
  onRefund,
}: UsePaymentColumnsOptions): ColumnDef<PaymentListItem, unknown>[] {
  const { t } = useTranslation('payments');

  return useMemo(
    () => [
      {
        accessorKey: 'bookingRef',
        header: t('list.booking'),
        cell: ({ row }) => (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetails(row.original);
            }}
          >
            {row.original.bookingRef}
          </Button>
        ),
        enableSorting: false,
      },
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
        header: t('list.shop'),
        cell: ({ row }) => <TruncatedText text={row.original.shopName} />,
        enableSorting: false,
      },
      {
        accessorKey: 'amountPaise',
        header: ({ column }) => <SortableHeader column={column} label={t('list.amount')} />,
        cell: ({ row }) => formatInrFromPaise(row.original.amountPaise),
      },
      {
        accessorKey: 'method',
        header: t('list.method'),
        cell: ({ row }) => t(`method.${row.original.method}`),
        enableSorting: false,
      },
      {
        accessorKey: 'gateway',
        header: t('list.gateway'),
        cell: ({ row }) => (
          <Badge variant="outline">{t(`gateway.${row.original.gateway}`)}</Badge>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: t('list.status'),
        cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
        enableSorting: false,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <SortableHeader column={column} label={t('list.date')} />,
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy, HH:mm'),
      },
      {
        id: 'actions',
        header: t('list.actions'),
        cell: ({ row }) => (
          <PaymentRowActions
            payment={row.original}
            onViewDetails={onViewDetails}
            onRefund={onRefund}
          />
        ),
        enableSorting: false,
      },
    ],
    [onRefund, onViewDetails, t],
  );
}
