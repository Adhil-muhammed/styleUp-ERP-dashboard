import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';

export const CALENDAR_WEEK_STARTS_ON = 1 as const;

export function getVisibleRange(
  date: Date,
  view: CalendarViewMode,
): { start: string; end: string } {
  switch (view) {
    case 'month': {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
      const end = endOfWeek(date, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
      return { start: start.toISOString(), end: end.toISOString() };
    }
    case 'day': {
      const start = startOfDay(date);
      const end = endOfDay(date);
      return { start: start.toISOString(), end: end.toISOString() };
    }
  }
}
