import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import type { CustomerNotification } from '@/features/user-management/types/customer-tabs';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerNotificationColumns(): ColumnDef<CustomerNotification, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        accessorKey: 'channel',
        header: t('notifications.columns.channel'),
        cell: ({ row }) => row.original.channel,
      },
      {
        accessorKey: 'title',
        header: t('notifications.columns.title'),
        cell: ({ row }) => <TruncatedText text={row.original.title} className="font-medium" />,
      },
      {
        accessorKey: 'status',
        header: t('notifications.columns.status'),
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
      },
      {
        accessorKey: 'sentAt',
        header: t('notifications.columns.sentAt'),
        cell: ({ row }) => format(new Date(row.original.sentAt), 'dd MMM yyyy, HH:mm'),
      },
    ],
    [t],
  );
}
