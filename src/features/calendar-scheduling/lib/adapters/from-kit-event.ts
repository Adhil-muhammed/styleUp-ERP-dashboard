import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';

export function findScheduleEvent(
  events: ScheduleEvent[],
  kitEventId: string,
): ScheduleEvent | undefined {
  return events.find((event) => event.id === kitEventId);
}
