import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';

import { TruncatedText } from '@/shared/components/text/TruncatedText';
import { formatInr } from '@/features/dashboard/lib/formatters';
import type {
  ActivityItemMap,
  ActivityTab,
  RecentBooking,
  RecentRefund,
  RecentRegistration,
  RecentReview,
  SystemAlert,
} from '@/features/dashboard/types/dashboard-activity';
import { Badge } from '@/shared/components/ui/badge';

function bookingStatusVariant(
  status: RecentBooking['status'],
): 'default' | 'secondary' | 'destructive' {
  if (status === 'cancelled') return 'destructive';
  if (status === 'completed') return 'default';
  return 'secondary';
}

function refundStatusVariant(
  status: RecentRefund['status'],
): 'default' | 'secondary' | 'destructive' {
  if (status === 'failed') return 'destructive';
  if (status === 'processed') return 'default';
  return 'secondary';
}

function alertSeverityVariant(
  severity: SystemAlert['severity'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (severity === 'critical') return 'destructive';
  if (severity === 'warning') return 'outline';
  return 'secondary';
}

export function useActivityColumns<T extends ActivityTab>(
  tab: T,
): ColumnDef<ActivityItemMap[T], unknown>[] {
  const { t } = useTranslation('dashboard');

  return useMemo(() => {
    switch (tab) {
      case 'bookings':
        return [
          {
            accessorKey: 'customerName',
            header: t('activity.columns.customer'),
            cell: ({ row }) => {
              const booking = row.original as RecentBooking;
              return <TruncatedText text={booking.customerName} className="font-medium" />;
            },
          },
          {
            accessorKey: 'shopName',
            header: t('activity.columns.shop'),
            cell: ({ row }) => {
              const booking = row.original as RecentBooking;
              return <TruncatedText text={booking.shopName} />;
            },
          },
          {
            accessorKey: 'serviceName',
            header: t('activity.columns.service'),
            cell: ({ row }) => {
              const booking = row.original as RecentBooking;
              return <TruncatedText text={booking.serviceName} />;
            },
          },
          {
            accessorKey: 'status',
            header: t('activity.columns.status'),
            cell: ({ row }) => {
              const booking = row.original as RecentBooking;
              return (
                <Badge variant={bookingStatusVariant(booking.status)}>
                  {t(`activity.status.${booking.status}`)}
                </Badge>
              );
            },
          },
          {
            accessorKey: 'scheduledAt',
            header: t('activity.columns.scheduledAt'),
            cell: ({ row }) => {
              const booking = row.original as RecentBooking;
              return (
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(booking.scheduledAt), { addSuffix: true })}
                </span>
              );
            },
          },
        ] as ColumnDef<ActivityItemMap[T], unknown>[];

      case 'registrations':
        return [
          {
            accessorKey: 'name',
            header: t('activity.columns.name'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as RecentRegistration).name} className="font-medium" />
            ),
          },
          {
            accessorKey: 'email',
            header: t('activity.columns.email'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as RecentRegistration).email} />
            ),
          },
          {
            accessorKey: 'type',
            header: t('activity.columns.type'),
            cell: ({ row }) => {
              const registration = row.original as RecentRegistration;
              return <Badge variant="secondary">{t(`activity.types.${registration.type}`)}</Badge>;
            },
          },
          {
            accessorKey: 'registeredAt',
            header: t('activity.columns.registeredAt'),
            cell: ({ row }) => {
              const registration = row.original as RecentRegistration;
              return (
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(registration.registeredAt), { addSuffix: true })}
                </span>
              );
            },
          },
        ] as ColumnDef<ActivityItemMap[T], unknown>[];

      case 'reviews':
        return [
          {
            accessorKey: 'customerName',
            header: t('activity.columns.customer'),
            cell: ({ row }) => {
              const review = row.original as RecentReview;
              return (
                <TruncatedText
                  text={`${review.customerName} · ${review.shopName}`}
                  className="font-medium"
                />
              );
            },
          },
          {
            accessorKey: 'rating',
            header: t('activity.columns.rating'),
            cell: ({ row }) => {
              const review = row.original as RecentReview;
              return <Badge variant="secondary">{`${String(review.rating)}/5`}</Badge>;
            },
          },
          {
            accessorKey: 'comment',
            header: t('activity.columns.comment'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as RecentReview).comment} lines={2} />
            ),
          },
          {
            accessorKey: 'createdAt',
            header: t('activity.columns.reviewedAt'),
            cell: ({ row }) => {
              const review = row.original as RecentReview;
              return (
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              );
            },
          },
        ] as ColumnDef<ActivityItemMap[T], unknown>[];

      case 'refunds':
        return [
          {
            accessorKey: 'customerName',
            header: t('activity.columns.customer'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as RecentRefund).customerName} className="font-medium" />
            ),
          },
          {
            accessorKey: 'bookingId',
            header: t('activity.columns.bookingId'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as RecentRefund).bookingId} />
            ),
          },
          {
            accessorKey: 'amount',
            header: t('activity.columns.amount'),
            cell: ({ row }) => (
              <span className="font-medium tabular-nums">
                {formatInr((row.original as RecentRefund).amount)}
              </span>
            ),
          },
          {
            accessorKey: 'status',
            header: t('activity.columns.status'),
            cell: ({ row }) => {
              const refund = row.original as RecentRefund;
              return (
                <Badge variant={refundStatusVariant(refund.status)}>
                  {t(`activity.status.${refund.status}`)}
                </Badge>
              );
            },
          },
          {
            accessorKey: 'requestedAt',
            header: t('activity.columns.requestedAt'),
            cell: ({ row }) => {
              const refund = row.original as RecentRefund;
              return (
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(refund.requestedAt), { addSuffix: true })}
                </span>
              );
            },
          },
        ] as ColumnDef<ActivityItemMap[T], unknown>[];

      case 'alerts':
        return [
          {
            accessorKey: 'severity',
            header: t('activity.columns.severity'),
            cell: ({ row }) => {
              const alert = row.original as SystemAlert;
              return (
                <Badge variant={alertSeverityVariant(alert.severity)}>
                  {t(`activity.severity.${alert.severity}`)}
                </Badge>
              );
            },
          },
          {
            accessorKey: 'message',
            header: t('activity.columns.message'),
            cell: ({ row }) => (
              <TruncatedText text={(row.original as SystemAlert).message} lines={2} />
            ),
          },
          {
            accessorKey: 'createdAt',
            header: t('activity.columns.createdAt'),
            cell: ({ row }) => {
              const alert = row.original as SystemAlert;
              return (
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                </span>
              );
            },
          },
        ] as ColumnDef<ActivityItemMap[T], unknown>[];

      default:
        return [];
    }
  }, [tab, t]);
}
