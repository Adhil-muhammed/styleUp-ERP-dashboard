import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';

import { StaffAvailabilityBadge } from '@/features/staff-management/components/StaffAvailabilityBadge';
import { StaffRowActions } from '@/features/staff-management/components/StaffRowActions';
import { StaffStatusBadge } from '@/features/staff-management/components/StaffStatusBadge';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { StarRating } from '@/shared/components/rating/StarRating';
import { TruncatedText } from '@/shared/components/text/TruncatedText';
import { staffDetailPath } from '@/shared/config/routes';

export function useStaffColumns(): ColumnDef<StaffListItem, unknown>[] {
  const { t } = useTranslation('staff-management');
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.name')} />,
        cell: ({ row }) => (
          <button
            type="button"
            className="text-left font-medium hover:underline"
            onClick={() => {
              void navigate(staffDetailPath(row.original.id));
            }}
          >
            <TruncatedText text={row.original.name} />
          </button>
        ),
      },
      {
        accessorKey: 'shopName',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.shop')} />,
        cell: ({ row }) => <TruncatedText text={row.original.shopName} />,
      },
      {
        accessorKey: 'role',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.role')} />,
        cell: ({ row }) => t(`role.${row.original.role}`),
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.rating')} />,
        cell: ({ row }) => <StarRating value={row.original.rating} size="sm" showValue />,
      },
      {
        accessorKey: 'availability',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('columns.availability')} />
        ),
        cell: ({ row }) => <StaffAvailabilityBadge availability={row.original.availability} />,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader column={column} label={t('columns.status')} />,
        cell: ({ row }) => <StaffStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => <StaffRowActions staff={row.original} />,
        enableSorting: false,
      },
    ],
    [navigate, t],
  );
}
