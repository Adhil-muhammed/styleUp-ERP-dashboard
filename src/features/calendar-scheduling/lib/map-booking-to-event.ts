import type { BookingCalendarRecord } from '@/features/booking-management/api/booking-management-api';
import { addMinutesToIso, makeEventId } from '@/features/calendar-scheduling/lib/calendar-date-utils';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';

export function mapBookingToCalendarEvent(booking: BookingCalendarRecord): ScheduleEvent {
  const end = addMinutesToIso(booking.scheduledAt, booking.durationMinutes);
  const title =
    booking.kind === 'package' && booking.packageName
      ? `${booking.customerName} — ${booking.packageName}`
      : `${booking.customerName} — ${booking.serviceName}`;

  return {
    id: makeEventId('booking', booking.id),
    kind: 'booking',
    title,
    start: booking.scheduledAt,
    end,
    staffId: booking.staffId,
    meta: {
      kind: 'booking',
      bookingStatus: booking.status,
      entityId: booking.id,
      staffId: booking.staffId,
      shopId: booking.merchantId,
    },
  };
}
