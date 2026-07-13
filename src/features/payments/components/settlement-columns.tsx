import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { SettlementStatusBadge } from '@/features/payments/components/SettlementStatusBadge';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import type { SettlementSummaryItem } from '@/features/payments/types/settlement';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useSettlementColumns(): ColumnDef<SettlementSummaryItem, unknown>[] {
  const { t } = useTranslation('payments');

  return useMemo(
    () => [
      {
        accessorKey: 'shopName',
        header: t('settlement.shop'),
        cell: ({ row }) => <TruncatedText text={row.original.shopName} className="font-medium" />,
      },
      {
        id: 'period',
        header: t('settlement.period'),
        cell: ({ row }) =>
          `${format(new Date(row.original.periodStart), 'dd MMM yyyy')} – ${format(
            new Date(row.original.periodEnd),
            'dd MMM yyyy',
          )}`,
      },
      {
        accessorKey: 'grossRevenuePaise',
        header: t('settlement.gross'),
        cell: ({ row }) => formatInrFromPaise(row.original.grossRevenuePaise),
      },
      {
        accessorKey: 'platformCommissionPaise',
        header: t('settlement.commission'),
        cell: ({ row }) => formatInrFromPaise(row.original.platformCommissionPaise),
      },
      {
        accessorKey: 'netPayablePaise',
        header: t('settlement.netPayable'),
        cell: ({ row }) => formatInrFromPaise(row.original.netPayablePaise),
      },
      {
        accessorKey: 'status',
        header: t('settlement.statusLabel'),
        cell: ({ row }) => <SettlementStatusBadge status={row.original.status} />,
      },
    ],
    [t],
  );
}
