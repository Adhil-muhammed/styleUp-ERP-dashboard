import type { Holiday } from '@/features/calendar-scheduling/types/holiday';

export type HolidayOccurrence = {
  startDate: string;
  endDate: string;
  occurrenceKey: string;
};

function yearFromIso(iso: string): number {
  return Number(iso.slice(0, 4));
}

function shiftYear(dateIso: string, targetYear: number): string {
  const monthDay = dateIso.slice(4);
  return `${targetYear}${monthDay}`;
}

/**
 * Expands yearly recurring holidays into concrete date ranges for the visible window.
 * CalendarKit Basic has no RRULE support — materialize occurrences in the API layer.
 */
export function materializeHolidayOccurrences(
  holiday: Holiday,
  rangeStart: string,
  rangeEnd: string,
): HolidayOccurrence[] {
  const rangeStartYear = yearFromIso(rangeStart);
  const rangeEndYear = yearFromIso(rangeEnd);

  if (!holiday.recurringYearly) {
    const start = `${holiday.startDate}T00:00:00.000Z`;
    const end = `${holiday.endDate}T23:59:59.999Z`;
    if (end < rangeStart || start > rangeEnd) {
      return [];
    }
    return [{ startDate: holiday.startDate, endDate: holiday.endDate, occurrenceKey: holiday.id }];
  }

  const occurrences: HolidayOccurrence[] = [];
  for (let year = rangeStartYear; year <= rangeEndYear; year += 1) {
    const startDate = shiftYear(holiday.startDate, year);
    const endDate = shiftYear(holiday.endDate, year);
    const start = `${startDate}T00:00:00.000Z`;
    const end = `${endDate}T23:59:59.999Z`;
    if (end < rangeStart || start > rangeEnd) {
      continue;
    }
    occurrences.push({
      startDate,
      endDate,
      occurrenceKey: `${holiday.id}-${year}`,
    });
  }
  return occurrences;
}
