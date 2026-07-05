import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { formatInr } from '@/features/dashboard/lib/formatters';
import { ServiceVariantRowActions } from '@/features/service-catalog/components/ServiceVariantRowActions';
import { ServiceVariantStatusBadge } from '@/features/service-catalog/components/ServiceVariantStatusBadge';
import type { ServiceVariantListItem } from '@/features/service-catalog/types/service-variant';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useServiceVariantColumns(): ColumnDef<ServiceVariantListItem, unknown>[] {
  const { t } = useTranslation('service-catalog');

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.name')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.imageUrl ? (
              <img
                src={row.original.imageUrl}
                alt=""
                className="size-8 shrink-0 rounded-md object-cover"
              />
            ) : null}
            <TruncatedText text={row.original.name} className="font-medium" />
          </div>
        ),
      },
      {
        accessorKey: 'categoryName',
        header: t('columns.category'),
        cell: ({ row }) => <TruncatedText text={row.original.categoryName} />,
        enableSorting: false,
      },
      {
        accessorKey: 'gender',
        header: t('columns.gender'),
        cell: ({ row }) => t(`gender.${row.original.gender}`),
        enableSorting: false,
      },
      {
        accessorKey: 'durationMinutes',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.duration')} />
        ),
        cell: ({ row }) => t('list.durationMinutes', { count: row.original.durationMinutes }),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.price')} />,
        cell: ({ row }) => formatInr(row.original.price),
      },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <ServiceVariantStatusBadge status={row.original.status} />,
        enableSorting: false,
      },
      {
        accessorKey: 'sortOrder',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.sortOrder')} />
        ),
        cell: ({ row }) => row.original.sortOrder,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => <ServiceVariantRowActions variant={row.original} />,
        enableSorting: false,
      },
    ],
    [t],
  );
}
