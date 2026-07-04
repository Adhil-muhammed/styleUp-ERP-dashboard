import { formatDistanceToNow } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { TruncatedText } from '@/features/dashboard/components/TruncatedText';
import { formatInr } from '@/features/dashboard/lib/formatters';
import type {
  ActivityItemMap,
  ActivityTab,
  RecentBooking,
  RecentRegistration,
  RecentRefund,
  RecentReview,
  SystemAlert,
} from '@/features/dashboard/types/dashboard-activity';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface RecentActivityListProps<T extends ActivityTab> {
  tab: T;
  items: ActivityItemMap[T][];
}

const ROW_CLASS =
  'flex min-h-14 flex-col gap-1 border-b py-3 last:border-b-0 sm:min-h-0 sm:flex-row sm:items-center sm:justify-between';

function StatusBadge({
  label,
  variant = 'secondary',
}: {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}): React.ReactElement {
  return <Badge variant={variant}>{label}</Badge>;
}

function BookingRow({ item }: { item: RecentBooking }): React.ReactElement {
  const { t } = useTranslation('dashboard');

  const statusVariant =
    item.status === 'cancelled'
      ? 'destructive'
      : item.status === 'completed'
        ? 'default'
        : 'secondary';

  return (
    <div className={ROW_CLASS}>
      <div className="min-w-0 space-y-0.5">
        <TruncatedText text={item.customerName} className="font-medium" />
        <TruncatedText
          text={`${item.serviceName} · ${item.shopName}`}
          className="text-sm text-muted-foreground"
        />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <StatusBadge label={t(`activity.status.${item.status}`)} variant={statusVariant} />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.scheduledAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

function RegistrationRow({ item }: { item: RecentRegistration }): React.ReactElement {
  const { t } = useTranslation('dashboard');

  return (
    <div className={ROW_CLASS}>
      <div className="min-w-0 space-y-0.5">
        <TruncatedText text={item.name} className="font-medium" />
        <TruncatedText text={item.email} className="text-sm text-muted-foreground" />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <StatusBadge label={t(`activity.types.${item.type}`)} />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.registeredAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

function ReviewRow({ item }: { item: RecentReview }): React.ReactElement {
  return (
    <div className={cn(ROW_CLASS, 'sm:items-start')}>
      <div className="min-w-0 space-y-0.5">
        <TruncatedText
          text={`${item.customerName} · ${item.shopName}`}
          className="font-medium"
        />
        <TruncatedText text={item.comment} className="text-sm text-muted-foreground" lines={2} />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <StatusBadge label={`${item.rating}/5`} />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

function RefundRow({ item }: { item: RecentRefund }): React.ReactElement {
  const { t } = useTranslation('dashboard');

  const statusVariant =
    item.status === 'failed' ? 'destructive' : item.status === 'processed' ? 'default' : 'secondary';

  return (
    <div className={ROW_CLASS}>
      <div className="min-w-0 space-y-0.5">
        <TruncatedText text={item.customerName} className="font-medium" />
        <TruncatedText
          text={`${t('activity.columns.bookingId')}: ${item.bookingId}`}
          className="text-sm text-muted-foreground"
        />
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 sm:flex-row sm:items-center">
        <span className="text-sm font-medium tabular-nums">{formatInr(item.amount)}</span>
        <StatusBadge label={t(`activity.status.${item.status}`)} variant={statusVariant} />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.requestedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

function AlertRow({ item }: { item: SystemAlert }): React.ReactElement {
  const { t } = useTranslation('dashboard');

  const severityVariant =
    item.severity === 'critical'
      ? 'destructive'
      : item.severity === 'warning'
        ? 'outline'
        : 'secondary';

  return (
    <div className={cn(ROW_CLASS, 'sm:items-start')}>
      <div className="min-w-0 space-y-0.5">
        <StatusBadge label={t(`activity.severity.${item.severity}`)} variant={severityVariant} />
        <TruncatedText text={item.message} className="text-sm" lines={2} />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </span>
    </div>
  );
}

export function RecentActivityList<T extends ActivityTab>({
  tab,
  items,
}: RecentActivityListProps<T>): React.ReactElement {
  return (
    <div
      className={cn('max-h-64 overflow-y-auto pr-1 sm:max-h-80')}
      data-testid={`activity-list-${tab}`}
    >
      {items.map((item) => {
        switch (tab) {
          case 'bookings':
            return <BookingRow key={item.id} item={item as RecentBooking} />;
          case 'registrations':
            return <RegistrationRow key={item.id} item={item as RecentRegistration} />;
          case 'reviews':
            return <ReviewRow key={item.id} item={item as RecentReview} />;
          case 'refunds':
            return <RefundRow key={item.id} item={item as RecentRefund} />;
          case 'alerts':
            return <AlertRow key={item.id} item={item as SystemAlert} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
