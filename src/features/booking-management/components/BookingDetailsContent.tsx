import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BookingActionBar } from '@/features/booking-management/components/BookingActionBar';
import { BookingCustomerSection } from '@/features/booking-management/components/BookingCustomerSection';
import { BookingNotesSection } from '@/features/booking-management/components/BookingNotesSection';
import { BookingPackageSection } from '@/features/booking-management/components/BookingPackageSection';
import { BookingPaymentSection } from '@/features/booking-management/components/BookingPaymentSection';
import { BookingServiceSection } from '@/features/booking-management/components/BookingServiceSection';
import { BookingSpecialistSection } from '@/features/booking-management/components/BookingSpecialistSection';
import { BookingPaymentStatusBadge } from '@/features/booking-management/components/BookingPaymentStatusBadge';
import { BookingStatusBadge } from '@/features/booking-management/components/BookingStatusBadge';
import { BookingTimeline } from '@/features/booking-management/components/BookingTimeline';
import { useBookingDetailQuery } from '@/features/booking-management/hooks/use-booking-management-queries';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';

type BookingDetailsContentProps = {
  bookingId: string;
};

function DetailsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function BookingDetailsContent({
  bookingId,
}: BookingDetailsContentProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { data, isPending, isError } = useBookingDetailQuery(bookingId);

  return (
    <QuerySection isPending={isPending} isError={isError} skeleton={<DetailsSkeleton />}>
      {data ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <BookingStatusBadge status={data.status} />
            <BookingPaymentStatusBadge status={data.paymentStatus} />
            <span className="text-xs text-muted-foreground">
              {format(new Date(data.scheduledAt), 'dd MMM yyyy, HH:mm')}
            </span>
          </div>

          <BookingCustomerSection data={data} />

          {data.kind === 'package' ? (
            <BookingPackageSection data={data} />
          ) : (
            <BookingServiceSection data={data} />
          )}

          <BookingSpecialistSection data={data} />

          <section className="space-y-3">
            <h3 className="text-sm font-medium">{t('details.timeline')}</h3>
            <BookingTimeline events={data.timeline} />
          </section>

          <BookingPaymentSection data={data} />
          <BookingNotesSection data={data} />
        </div>
      ) : null}
    </QuerySection>
  );
}

export function BookingDetailsFooter({ bookingId }: { bookingId: string }): React.ReactElement | null {
  const { data } = useBookingDetailQuery(bookingId);
  if (!data) return <Skeleton className="h-9 w-full" />;
  return <BookingActionBar data={data} />;
}
