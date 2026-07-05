import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { CategoryRowActions } from '@/features/service-catalog/components/CategoryRowActions';
import { CategoryStatusBadge } from '@/features/service-catalog/components/CategoryStatusBadge';
import type { ServiceCategoryListItem } from '@/features/service-catalog/types/category';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export function useCategoryColumns(): ColumnDef<ServiceCategoryListItem, unknown>[] {
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
        accessorKey: 'variantCount',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.variantCount')} />
        ),
        cell: ({ row }) => row.original.variantCount,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.status')} />,
        cell: ({ row }) => <CategoryStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => <CategoryRowActions category={row.original} />,
        enableSorting: false,
      },
    ],
    [t],
  );
}
