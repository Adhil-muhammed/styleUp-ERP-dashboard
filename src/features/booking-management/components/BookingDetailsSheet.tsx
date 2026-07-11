import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BookingDetailsContent,
  BookingDetailsFooter,
} from '@/features/booking-management/components/BookingDetailsContent';
import { useBookingDetailQuery } from '@/features/booking-management/hooks/use-booking-management-queries';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Sheet } from '@/shared/components/ui/sheet';
import { Skeleton } from '@/shared/components/ui/skeleton';

type BookingDetailsSheetProps = {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookingDetailsSheet({
  bookingId,
  open,
  onOpenChange,
}: BookingDetailsSheetProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { data } = useBookingDetailQuery(bookingId ?? '');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        className="sm:max-w-lg"
        title={
          data
            ? t('details.title', { id: data.id })
            : t('details.loadingTitle')
        }
        footer={
          bookingId ? (
            <BookingDetailsFooter bookingId={bookingId} />
          ) : (
            <Skeleton className="h-9 w-full" />
          )
        }
      >
        {bookingId ? <BookingDetailsContent bookingId={bookingId} /> : null}
      </FormSheetContent>
    </Sheet>
  );
}
