import type { CalendarEvent as KitCalendarEvent } from 'calendarkit-basic';

import {
  getBookingCalendarId,
  getEventColor,
} from '@/features/calendar-scheduling/lib/calendar-event-colors';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';

export function resolveCalendarId(
  event: ScheduleEvent,
  mode: 'shop' | 'staff' = 'shop',
): string {
  if (mode === 'staff' && event.staffId) {
    if (event.kind === 'booking' || event.kind === 'break') {
      return event.staffId;
    }
    if (event.kind === 'blocked') {
      return `blocked-${event.staffId}`;
    }
    if (event.kind === 'recurring') {
      return `recurring-${event.staffId}`;
    }
  }

  if (event.kind === 'booking' && event.meta.bookingStatus) {
    return getBookingCalendarId(event.meta.bookingStatus);
  }
  if (event.kind === 'blocked') {
    return event.staffId ? `blocked-${event.staffId}` : 'blocked';
  }
  if (event.kind === 'recurring' && event.staffId) {
    return `recurring-${event.staffId}`;
  }
  return event.kind;
}

export function toKitEvent(
  event: ScheduleEvent,
  mode: 'shop' | 'staff' = 'shop',
): KitCalendarEvent {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.allDay,
    color: getEventColor(event.kind, event.meta.bookingStatus),
    calendarId: resolveCalendarId(event, mode),
  };
}

export function toKitEvents(
  events: ScheduleEvent[],
  mode: 'shop' | 'staff' = 'shop',
): KitCalendarEvent[] {
  return events.map((event) => toKitEvent(event, mode));
}
