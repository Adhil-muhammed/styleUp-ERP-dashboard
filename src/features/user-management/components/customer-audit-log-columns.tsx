import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { CustomerAuditLog } from '@/features/user-management/types/customer-tabs';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerAuditLogColumns(): ColumnDef<CustomerAuditLog, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'action',
        header: t('auditLogs.columns.action'),
        cell: ({ row }) => <TruncatedText text={row.original.action} className="font-medium" />,
      },
      {
        accessorKey: 'actor',
        header: t('auditLogs.columns.actor'),
        cell: ({ row }) => row.original.actor,
      },
      {
        accessorKey: 'createdAt',
        header: t('auditLogs.columns.date'),
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy, HH:mm'),
      },
    ],
    [t],
  );
}
