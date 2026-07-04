import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { CustomerAvatar } from '@/features/user-management/components/CustomerAvatar';
import { CustomerRowActions } from '@/features/user-management/components/CustomerRowActions';
import { CustomerStatusBadge } from '@/features/user-management/components/CustomerStatusBadge';
import type { CustomerListItem } from '@/features/user-management/types/customer';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCustomerColumns(): ColumnDef<CustomerListItem, unknown>[] {
  const { t } = useTranslation('user-management');

  return useMemo(
    () => [
      {
        id: 'avatar',
        header: '',
        cell: ({ row }) => (
          <CustomerAvatar name={row.original.name} avatarUrl={row.original.avatarUrl} size="sm" />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.name')} />,
        cell: ({ row }) => <TruncatedText text={row.original.name} className="font-medium" />,
      },
      {
        accessorKey: 'email',
        header: t('columns.email'),
        cell: ({ row }) => (
          <TruncatedText text={row.original.email} className="text-muted-foreground" />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'phone',
        header: t('columns.phone'),
        cell: ({ row }) => <TruncatedText text={row.original.phone} />,
        enableSorting: false,
      },
      {
        accessorKey: 'country',
        header: t('columns.country'),
        cell: ({ row }) => row.original.country,
        enableSorting: false,
      },
      {
        accessorKey: 'xp',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.xp')} />,
        cell: ({ row }) => row.original.xp.toLocaleString(),
      },
      {
        accessorKey: 'level',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.level')} />,
        cell: ({ row }) => row.original.level,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.status')} />,
        cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'lastLoginAt',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.lastLogin')} />,
        cell: ({ row }) =>
          row.original.lastLoginAt
            ? formatDistanceToNow(new Date(row.original.lastLoginAt), { addSuffix: true })
            : t('list.neverLoggedIn'),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => <CustomerRowActions customer={row.original} />,
        enableSorting: false,
      },
    ],
    [t],
  );
}
