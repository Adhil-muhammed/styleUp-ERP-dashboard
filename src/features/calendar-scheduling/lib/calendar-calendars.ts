import {
  getBookingCalendarId,
  KIND_COLORS,
  LEGEND_ITEMS,
} from '@/features/calendar-scheduling/lib/calendar-event-colors';
import type { CalendarFilter } from '@/features/calendar-scheduling/types/schedule-event';
import type { BookingStatus } from '@/features/booking-management/types/booking';

const BOOKING_STATUSES: BookingStatus[] = [
  'confirmed',
  'pending',
  'completed',
  'cancelled',
  'no_show',
];

export function buildShopCalendars(activeIds?: Set<string>): CalendarFilter[] {
  return LEGEND_ITEMS.map((item) => {
    const id =
      item.key === 'holiday' || item.key === 'blocked' || item.key === 'break' || item.key === 'recurring'
        ? item.key
        : getBookingCalendarId(item.key as BookingStatus);
    return {
      id,
      label: item.key,
      color: item.color,
      active: activeIds ? activeIds.has(id) : true,
    };
  });
}

export function buildStaffCalendars(
  staff: { id: string; name: string }[],
  activeIds?: Set<string>,
): CalendarFilter[] {
  return staff.map((member, index) => ({
    id: member.id,
    label: member.name,
    color: STAFF_PALETTE[index % STAFF_PALETTE.length],
    active: activeIds ? activeIds.has(member.id) : true,
  }));
}

export function buildHolidayCalendars(): CalendarFilter[] {
  return [{ id: 'holiday', label: 'holiday', color: KIND_COLORS.holiday, active: true }];
}

export function buildBlockedCalendars(): CalendarFilter[] {
  return [{ id: 'blocked', label: 'blocked', color: KIND_COLORS.blocked, active: true }];
}

export function bookingStatusCalendarIds(): string[] {
  return BOOKING_STATUSES.map(getBookingCalendarId);
}

const STAFF_PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#ef4444',
];
