import type { ViewType } from 'calendarkit-basic';

export type {
  CalendarEventsParams,
  CalendarFilter,
  MoveCalendarEventInput,
  ScheduleEvent,
  ScheduleEventKind,
  ScheduleEventMeta,
} from '@/features/calendar-scheduling/types/schedule-event';

/** CalendarKit Basic supports month, week, and day only (no agenda/resource). */
export type CalendarViewMode = ViewType;

/** @deprecated Use ScheduleEvent — kept for API-layer compatibility during migration. */
export type CalendarEvent = import('@/features/calendar-scheduling/types/schedule-event').ScheduleEvent;

/** @deprecated Use ScheduleEventMeta */
export type CalendarEventExtendedProps =
  import('@/features/calendar-scheduling/types/schedule-event').ScheduleEventMeta;

/** @deprecated Use ScheduleEventKind */
export type CalendarEventKind =
  import('@/features/calendar-scheduling/types/schedule-event').ScheduleEventKind;

/** Resource/timeline views require CalendarKit Pro — not available in Basic. */
export type CalendarResource = {
  id: string;
  title: string;
};
