/**
 * Calendar & Scheduling API — fixture-backed until backend endpoints are live.
 */
import { getBookingsInRange, rescheduleBooking } from '@/features/booking-management/api/booking-management-api';
import { blockedSlotsFixture } from '@/features/calendar-scheduling/api/fixtures/blocked-slots.fixture';
import { holidaysFixture } from '@/features/calendar-scheduling/api/fixtures/holidays.fixture';
import { recurringAvailabilityFixture } from '@/features/calendar-scheduling/api/fixtures/recurring-availability.fixture';
import { staffBreaksFixture } from '@/features/calendar-scheduling/api/fixtures/staff-breaks.fixture';
import { addMinutesToIso, eachDateInRange, makeEventId, overlapsRange, parseEventId } from '@/features/calendar-scheduling/lib/calendar-date-utils';
import { materializeHolidayOccurrences } from '@/features/calendar-scheduling/lib/materialize-holidays';
import { mapBookingToCalendarEvent } from '@/features/calendar-scheduling/lib/map-booking-to-event';
import type {
  CalendarEvent,
  CalendarEventKind,
  CalendarEventsParams,
  MoveCalendarEventInput,
} from '@/features/calendar-scheduling/types/calendar-event';
import type { BlockedSlot, CreateBlockedSlotInput, UpdateBlockedSlotInput } from '@/features/calendar-scheduling/types/blocked-slot';
import type { BulkScheduleInput, BulkSchedulePreview } from '@/features/calendar-scheduling/types/bulk-schedule';
import type { CreateHolidayInput, Holiday, HolidayConflict, UpdateHolidayInput } from '@/features/calendar-scheduling/types/holiday';
import type { CreateRecurringPatternInput, PatternException, RecurringPattern, UpdateRecurringPatternInput } from '@/features/calendar-scheduling/types/recurring-availability';
import type { CreateStaffBreakInput, StaffBreak, UpdateStaffBreakInput } from '@/features/calendar-scheduling/types/staff-break';
import { updateStaffWorkingHours } from '@/features/staff-management/api/staff-management-api';
import type { WorkingHours } from '@/features/merchant-management/types/working-hours';
import { mockDelay } from '@/shared/lib/mock-delay';
import type { ApiMutationResponse } from '@/shared/types/api';

let holidaysStore: Holiday[] = [...holidaysFixture];
let blockedStore: BlockedSlot[] = [...blockedSlotsFixture];
let breaksStore: StaffBreak[] = [...staffBreaksFixture];
let recurringStore: RecurringPattern[] = [...recurringAvailabilityFixture];

let nextHolidayId = 10;
let nextBlockedId = 10;
let nextBreakId = 10;
let nextRecurringId = 10;

function holidaysToEvents(holiday: Holiday, rangeStart: string, rangeEnd: string): CalendarEvent[] {
  return materializeHolidayOccurrences(holiday, rangeStart, rangeEnd).map((occurrence) => ({
    id: makeEventId('holiday', occurrence.occurrenceKey),
    kind: 'holiday',
    title: holiday.name,
    start: `${occurrence.startDate}T00:00:00.000Z`,
    end: `${occurrence.endDate}T23:59:59.999Z`,
    allDay: true,
    staffId: holiday.staffId,
    meta: {
      kind: 'holiday',
      entityId: holiday.id,
      shopId: holiday.shopId,
      staffId: holiday.staffId,
    },
  }));
}

function blockedToEvent(slot: BlockedSlot): CalendarEvent {
  return {
    id: makeEventId('blocked', slot.id),
    kind: 'blocked',
    title: slot.reason,
    start: slot.start,
    end: slot.end,
    staffId: slot.staffId,
    meta: {
      kind: 'blocked',
      entityId: slot.id,
      shopId: slot.shopId,
      staffId: slot.staffId,
      reason: slot.reason,
    },
  };
}

function breakToEvent(brk: StaffBreak): CalendarEvent {
  return {
    id: makeEventId('break', brk.id),
    kind: 'break',
    title: brk.label,
    start: brk.start,
    end: brk.end,
    staffId: brk.staffId,
    meta: {
      kind: 'break',
      entityId: brk.id,
      shopId: brk.shopId,
      staffId: brk.staffId,
    },
  };
}

const DAY_INDEX: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

function recurringToEvents(
  pattern: RecurringPattern,
  rangeStart: string,
  rangeEnd: string,
  staffIds?: string[],
): CalendarEvent[] {
  if (staffIds?.length && !staffIds.includes(pattern.staffId)) {
    return [];
  }
  if (pattern.shopId !== undefined) {
    // filtered by shop at caller
  }
  const events: CalendarEvent[] = [];
  const dates = eachDateInRange(rangeStart.slice(0, 10), rangeEnd.slice(0, 10));
  for (const date of dates) {
    if (date < pattern.effectiveFrom.slice(0, 10)) continue;
    if (pattern.effectiveTo && date > pattern.effectiveTo.slice(0, 10)) continue;
    const exception = pattern.exceptions.find((item) => item.date.slice(0, 10) === date);
    if (exception?.isUnavailable) continue;
    const dayIndex = new Date(`${date}T12:00:00.000Z`).getUTCDay();
    const dayKey = Object.entries(DAY_INDEX).find(([, idx]) => idx === dayIndex)?.[0];
    const daySchedule = pattern.schedule.find((item) => item.day === dayKey);
    if (!daySchedule) continue;
    const ranges = exception?.ranges ?? daySchedule.ranges;
    ranges.forEach((range, index) => {
      const start = `${date}T${range.openTime}:00.000Z`;
      const end = `${date}T${range.closeTime}:00.000Z`;
      events.push({
        id: makeEventId('recurring', `${pattern.id}-${date}-${index}`),
        kind: 'recurring',
        title: pattern.label,
        start,
        end,
        staffId: pattern.staffId,
        meta: {
          kind: 'recurring',
          entityId: pattern.id,
          shopId: pattern.shopId,
          staffId: pattern.staffId,
        },
      });
    });
  }
  return events;
}

export function getCalendarEvents(params: CalendarEventsParams): Promise<CalendarEvent[]> {
  const kinds = params.kinds ?? ['booking', 'holiday', 'blocked', 'break', 'recurring'];
  const tasks: Promise<CalendarEvent[]>[] = [];

  if (kinds.includes('booking')) {
    tasks.push(
      getBookingsInRange({
        shopId: params.shopId,
        rangeStart: params.rangeStart,
        rangeEnd: params.rangeEnd,
        staffIds: params.staffIds,
      }).then((bookings) => bookings.map(mapBookingToCalendarEvent)),
    );
  }

  const staticEvents: CalendarEvent[] = [];

  if (kinds.includes('holiday')) {
    holidaysStore
      .filter((h) => h.shopId === params.shopId)
      .forEach((h) => {
        if (params.staffIds?.length && h.staffId && !params.staffIds.includes(h.staffId)) return;
        staticEvents.push(...holidaysToEvents(h, params.rangeStart, params.rangeEnd));
      });
  }

  if (kinds.includes('blocked')) {
    blockedStore
      .filter((s) => s.shopId === params.shopId)
      .filter((s) => {
        if (!params.staffIds?.length) return true;
        if (s.scope === 'shop') return true;
        return s.staffId ? params.staffIds!.includes(s.staffId) : false;
      })
      .filter((s) => overlapsRange(s.start, s.end, params.rangeStart, params.rangeEnd))
      .forEach((s) => staticEvents.push(blockedToEvent(s)));
  }

  if (kinds.includes('break')) {
    breaksStore
      .filter((b) => b.shopId === params.shopId)
      .filter((b) => !params.staffIds?.length || params.staffIds.includes(b.staffId))
      .filter((b) => overlapsRange(b.start, b.end, params.rangeStart, params.rangeEnd))
      .forEach((b) => staticEvents.push(breakToEvent(b)));
  }

  if (kinds.includes('recurring')) {
    recurringStore
      .filter((p) => p.shopId === params.shopId)
      .forEach((p) => {
        staticEvents.push(...recurringToEvents(p, params.rangeStart, params.rangeEnd, params.staffIds));
      });
  }

  return Promise.all(tasks).then((groups) => mockDelay([...groups.flat(), ...staticEvents], 350));
}

export function getHolidays(shopId: string): Promise<Holiday[]> {
  return mockDelay(holidaysStore.filter((h) => h.shopId === shopId), 250);
}

export function createHoliday(input: CreateHolidayInput): Promise<Holiday> {
  const holiday: Holiday = { ...input, id: `hol-${String(nextHolidayId++).padStart(3, '0')}` };
  holidaysStore = [...holidaysStore, holiday];
  return mockDelay(holiday, 300);
}

export function updateHoliday(id: string, input: UpdateHolidayInput): Promise<Holiday> {
  const index = holidaysStore.findIndex((h) => h.id === id);
  if (index === -1) throw new Error(`Holiday not found: ${id}`);
  holidaysStore[index] = { ...holidaysStore[index], ...input };
  return mockDelay(holidaysStore[index], 300);
}

export function deleteHoliday(id: string): Promise<ApiMutationResponse> {
  holidaysStore = holidaysStore.filter((h) => h.id !== id);
  return mockDelay({ success: true }, 250);
}

export function checkHolidayConflicts(
  shopId: string,
  startDate: string,
  endDate: string,
): Promise<HolidayConflict[]> {
  const rangeStart = `${startDate}T00:00:00.000Z`;
  const rangeEnd = `${endDate}T23:59:59.999Z`;
  return getBookingsInRange({ shopId, rangeStart, rangeEnd }).then((bookings) =>
    mockDelay(
      bookings
        .filter((b) => b.status === 'confirmed' || b.status === 'pending')
        .map((b) => ({
          bookingId: b.id,
          customerName: b.customerName,
          scheduledAt: b.scheduledAt,
        })),
      250,
    ),
  );
}

export function getBlockedSlots(shopId: string): Promise<BlockedSlot[]> {
  return mockDelay(blockedStore.filter((s) => s.shopId === shopId), 250);
}

export function createBlockedSlot(input: CreateBlockedSlotInput): Promise<BlockedSlot> {
  const slot: BlockedSlot = { ...input, id: `blk-${String(nextBlockedId++).padStart(3, '0')}` };
  blockedStore = [...blockedStore, slot];
  return mockDelay(slot, 300);
}

export function updateBlockedSlot(id: string, input: UpdateBlockedSlotInput): Promise<BlockedSlot> {
  const index = blockedStore.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Blocked slot not found: ${id}`);
  blockedStore[index] = { ...blockedStore[index], ...input };
  return mockDelay(blockedStore[index], 300);
}

export function deleteBlockedSlot(id: string): Promise<ApiMutationResponse> {
  blockedStore = blockedStore.filter((s) => s.id !== id);
  return mockDelay({ success: true }, 250);
}

export function getStaffBreaks(shopId: string, staffIds?: string[]): Promise<StaffBreak[]> {
  let items = breaksStore.filter((b) => b.shopId === shopId);
  if (staffIds?.length) {
    items = items.filter((b) => staffIds.includes(b.staffId));
  }
  return mockDelay(items, 250);
}

export function createStaffBreak(input: CreateStaffBreakInput): Promise<StaffBreak> {
  const brk: StaffBreak = { ...input, id: `brk-${String(nextBreakId++).padStart(3, '0')}` };
  breaksStore = [...breaksStore, brk];
  return mockDelay(brk, 300);
}

export function updateStaffBreak(id: string, input: UpdateStaffBreakInput): Promise<StaffBreak> {
  const index = breaksStore.findIndex((b) => b.id === id);
  if (index === -1) throw new Error(`Break not found: ${id}`);
  breaksStore[index] = { ...breaksStore[index], ...input };
  return mockDelay(breaksStore[index], 300);
}

export function deleteStaffBreak(id: string): Promise<ApiMutationResponse> {
  breaksStore = breaksStore.filter((b) => b.id !== id);
  return mockDelay({ success: true }, 250);
}

export function getRecurringPatterns(shopId: string, staffId?: string): Promise<RecurringPattern[]> {
  let items = recurringStore.filter((p) => p.shopId === shopId);
  if (staffId) items = items.filter((p) => p.staffId === staffId);
  return mockDelay(items, 250);
}

export function createRecurringPattern(input: CreateRecurringPatternInput): Promise<RecurringPattern> {
  const pattern: RecurringPattern = {
    ...input,
    id: `rec-${String(nextRecurringId++).padStart(3, '0')}`,
    exceptions: input.exceptions ?? [],
  };
  recurringStore = [...recurringStore, pattern];
  return mockDelay(pattern, 300);
}

export function updateRecurringPattern(id: string, input: UpdateRecurringPatternInput): Promise<RecurringPattern> {
  const index = recurringStore.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Pattern not found: ${id}`);
  recurringStore[index] = { ...recurringStore[index], ...input };
  return mockDelay(recurringStore[index], 300);
}

export function deleteRecurringPattern(id: string): Promise<ApiMutationResponse> {
  recurringStore = recurringStore.filter((p) => p.id !== id);
  return mockDelay({ success: true }, 250);
}

export function addPatternException(id: string, exception: PatternException): Promise<RecurringPattern> {
  const index = recurringStore.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Pattern not found: ${id}`);
  recurringStore[index] = {
    ...recurringStore[index],
    exceptions: [...recurringStore[index].exceptions.filter((e) => e.date !== exception.date), exception],
  };
  return mockDelay(recurringStore[index], 300);
}

export function previewBulkSchedule(input: BulkScheduleInput): Promise<BulkSchedulePreview> {
  const dates = eachDateInRange(input.dateFrom, input.dateTo);
  const totalEntries = dates.length * input.staffIds.length;
  return mockDelay(
    {
      affectedStaffCount: input.staffIds.length,
      affectedDateCount: dates.length,
      totalEntries,
      sampleDates: dates.slice(0, 5),
    },
    300,
  );
}

export function applyBulkSchedule(input: BulkScheduleInput): Promise<ApiMutationResponse> {
  if (input.action === 'holiday' && input.holidayName) {
    return createHoliday({
      scope: 'shop',
      shopId: input.shopId,
      name: input.holidayName,
      startDate: input.dateFrom,
      endDate: input.dateTo,
      recurringYearly: false,
    }).then(() => ({ success: true }));
  }
  if (input.action === 'blocked' && input.blockedReason) {
    const slot: CreateBlockedSlotInput = {
      scope: 'shop',
      shopId: input.shopId,
      start: `${input.dateFrom}T00:00:00.000Z`,
      end: `${input.dateTo}T23:59:59.999Z`,
      reason: input.blockedReason,
    };
    return createBlockedSlot(slot).then(() => ({ success: true }));
  }
  if (input.action === 'working-hours' && input.workingHours) {
    const hours = input.workingHours;
    return Promise.all(
      input.staffIds.map((staffId) => updateStaffWorkingHours(staffId, hours as WorkingHours)),
    ).then(() => ({ success: true }));
  }
  return mockDelay({ success: true }, 300);
}

export function moveCalendarEvent(
  compositeId: string,
  input: MoveCalendarEventInput,
): Promise<ApiMutationResponse> {
  const { kind, entityId } = parseEventId(compositeId);
  if (kind === 'booking') {
    return rescheduleBooking(entityId, { scheduledAt: input.start });
  }
  if (kind === 'blocked') {
    return updateBlockedSlot(entityId, {
      start: input.start,
      end: input.end,
      staffId: input.staffId,
    }).then(() => ({ success: true }));
  }
  throw new Error(`Cannot move event of kind: ${kind}`);
}

export function getEventKindFromId(compositeId: string): CalendarEventKind {
  const { kind } = parseEventId(compositeId);
  if (kind === 'booking' || kind === 'holiday' || kind === 'blocked' || kind === 'break' || kind === 'recurring') {
    return kind;
  }
  return 'booking';
}

export function getBookingEndFromStart(start: string, durationMinutes = 60): string {
  return addMinutesToIso(start, durationMinutes);
}
