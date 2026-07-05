import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BookingPaymentStatusBadge } from '@/features/booking-management/components/BookingPaymentStatusBadge';
import { BookingRowActions } from '@/features/booking-management/components/BookingRowActions';
import { BookingStatusBadge } from '@/features/booking-management/components/BookingStatusBadge';
import type { BookingListItem } from '@/features/booking-management/types/booking';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type BookingMobileCardProps = {
  booking: BookingListItem;
  onViewDetails: (booking: BookingListItem) => void;
};

export function BookingMobileCard({
  booking,
  onViewDetails,
}: BookingMobileCardProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  const serviceLabel =
    booking.kind === 'package' && booking.packageName
      ? booking.packageName
      : booking.serviceName;

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="booking-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <TruncatedText text={booking.customerName} className="font-medium" />
          <TruncatedText text={booking.shopName} className="text-sm text-muted-foreground" />
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <BookingRowActions booking={booking} onViewDetails={onViewDetails} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">{t('list.staff')}: </span>
          {booking.staffName}
        </div>
        <div>
          <span className="text-muted-foreground">{t('list.amount')}: </span>
          {formatInr(booking.amount)}
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">{t('list.serviceOrPackage')}: </span>
          {serviceLabel}
        </div>
        <div className="col-span-2 text-muted-foreground">
          {format(new Date(booking.scheduledAt), 'dd MMM yyyy, HH:mm')}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <BookingStatusBadge status={booking.status} />
        <BookingPaymentStatusBadge status={booking.paymentStatus} />
      </div>
    </div>
  );
}
