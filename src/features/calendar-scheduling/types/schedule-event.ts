import type { BookingStatus } from '@/features/booking-management/types/booking';

export type ScheduleEventKind =
  | 'booking'
  | 'holiday'
  | 'blocked'
  | 'break'
  | 'recurring';

export type ScheduleEventMeta = {
  kind: ScheduleEventKind;
  bookingStatus?: BookingStatus;
  entityId: string;
  staffId?: string;
  shopId?: string;
  reason?: string;
};

/** Domain calendar event — ISO UTC strings; mapped to CalendarKit `Date` in the wrapper. */
export type ScheduleEvent = {
  id: string;
  kind: ScheduleEventKind;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  staffId?: string;
  meta: ScheduleEventMeta;
};

export type CalendarFilter = {
  id: string;
  label: string;
  color?: string;
  active?: boolean;
};

export type CalendarEventsParams = {
  shopId: string;
  rangeStart: string;
  rangeEnd: string;
  staffIds?: string[];
  kinds?: ScheduleEventKind[];
};

export type MoveCalendarEventInput = {
  start: string;
  end: string;
  staffId?: string;
};
