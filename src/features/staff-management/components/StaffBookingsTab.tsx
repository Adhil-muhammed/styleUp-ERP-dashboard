import { format } from 'date-fns';
import { useMemo } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import {
  StaffTabTable,
  useStaffTabQueryParams,
} from '@/features/staff-management/components/StaffTabTable';
import { useStaffBookingsQuery } from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffBooking, StaffBookingStatus } from '@/features/staff-management/types/staff-tabs';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SortableHeader } from '@/shared/components/data-table/SortableHeader';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

const BOOKING_STATUSES: StaffBookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

function useStaffBookingColumns(): ColumnDef<StaffBooking, unknown>[] {
  const { t } = useTranslation('staff-management');
  return useMemo(
    () => [
      {
        accessorKey: 'customerName',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('bookings.columns.customer')} />
        ),
        cell: ({ row }) => <TruncatedText text={row.original.customerName} className="font-medium" />,
      },
      {
        accessorKey: 'serviceName',
        header: t('bookings.columns.service'),
        cell: ({ row }) => <TruncatedText text={row.original.serviceName} />,
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: t('bookings.columns.status'),
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
        enableSorting: false,
      },
      {
        accessorKey: 'scheduledAt',
        header: ({ column }) => (
          <SortableHeader column={column} label={t('bookings.columns.date')} />
        ),
        cell: ({ row }) => format(new Date(row.original.scheduledAt), 'dd MMM yyyy, HH:mm'),
      },
      {
        accessorKey: 'amount',
        header: t('bookings.columns.amount'),
        cell: ({ row }) => formatInr(row.original.amount),
        enableSorting: false,
      },
    ],
    [t],
  );
}

type StaffBookingsTabProps = {
  staffId: string;
};

export function StaffBookingsTab({ staffId }: StaffBookingsTabProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const columns = useStaffBookingColumns();
  const { params, pagination, setPagination, search, handleSearchChange, status, setStatus } =
    useStaffTabQueryParams();
  const { data, isPending, isError, isFetching } = useStaffBookingsQuery(staffId, params);

  return (
    <StaffTabTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      isFetching={isFetching}
      emptyMessage={t('empty.bookings')}
      searchPlaceholder={t('bookings.searchPlaceholder')}
      pagination={pagination}
      onPaginationChange={setPagination}
      search={search}
      onSearchChange={handleSearchChange}
      filterSlot={
        <Select
          value={status ?? 'all'}
          onValueChange={(value) => setStatus(value === 'all' ? undefined : value)}
        >
          <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
            <SelectValue placeholder={t('bookings.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('list.filterAllStatus')}</SelectItem>
            {BOOKING_STATUSES.map((bookingStatus) => (
              <SelectItem key={bookingStatus} value={bookingStatus}>
                {bookingStatus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      renderMobileCard={(row) => (
        <div className="space-y-1">
          <TruncatedText text={row.customerName} className="font-medium" />
          <TruncatedText text={row.serviceName} className="text-sm text-muted-foreground" />
          <div className="flex items-center justify-between text-sm">
            <Badge variant="secondary">{row.status}</Badge>
            <span>{formatInr(row.amount)}</span>
          </div>
        </div>
      )}
    />
  );
}
