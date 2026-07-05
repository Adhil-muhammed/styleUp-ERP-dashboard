import type { ScheduleEventKind } from '@/features/calendar-scheduling/types/schedule-event';
import type { BookingStatus } from '@/features/booking-management/types/booking';

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  completed: '#22c55e',
  cancelled: '#94a3b8',
  no_show: '#ef4444',
};

export const KIND_COLORS: Record<ScheduleEventKind, string> = {
  booking: '#3b82f6',
  holiday: '#a855f7',
  blocked: '#64748b',
  break: '#f97316',
  recurring: '#06b6d4',
};

export function getEventColor(
  kind: ScheduleEventKind,
  bookingStatus?: BookingStatus,
): string {
  if (kind === 'booking' && bookingStatus) {
    return BOOKING_STATUS_COLORS[bookingStatus];
  }
  return KIND_COLORS[kind];
}

export function getBookingCalendarId(status: BookingStatus): string {
  return `booking-${status}`;
}

export const LEGEND_ITEMS = [
  { key: 'confirmed', color: BOOKING_STATUS_COLORS.confirmed },
  { key: 'pending', color: BOOKING_STATUS_COLORS.pending },
  { key: 'completed', color: BOOKING_STATUS_COLORS.completed },
  { key: 'cancelled', color: BOOKING_STATUS_COLORS.cancelled },
  { key: 'no_show', color: BOOKING_STATUS_COLORS.no_show },
  { key: 'holiday', color: KIND_COLORS.holiday },
  { key: 'blocked', color: KIND_COLORS.blocked },
  { key: 'break', color: KIND_COLORS.break },
  { key: 'recurring', color: KIND_COLORS.recurring },
] as const;
