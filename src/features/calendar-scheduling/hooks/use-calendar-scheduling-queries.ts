import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addPatternException,
  applyBulkSchedule,
  checkHolidayConflicts,
  createBlockedSlot,
  createHoliday,
  createRecurringPattern,
  createStaffBreak,
  deleteBlockedSlot,
  deleteHoliday,
  deleteRecurringPattern,
  getBlockedSlots,
  getCalendarEvents,
  getHolidays,
  getRecurringPatterns,
  getStaffBreaks,
  previewBulkSchedule,
  updateBlockedSlot,
  updateHoliday,
  updateRecurringPattern,
  updateStaffBreak,
} from '@/features/calendar-scheduling/api/calendar-scheduling-api';
import type { CalendarEventsParams } from '@/features/calendar-scheduling/types/calendar-event';
import type { BulkScheduleInput } from '@/features/calendar-scheduling/types/bulk-schedule';
import type { CreateBlockedSlotInput, UpdateBlockedSlotInput } from '@/features/calendar-scheduling/types/blocked-slot';
import type { CreateHolidayInput, UpdateHolidayInput } from '@/features/calendar-scheduling/types/holiday';
import type { CreateRecurringPatternInput, PatternException, UpdateRecurringPatternInput } from '@/features/calendar-scheduling/types/recurring-availability';
import type { CreateStaffBreakInput, UpdateStaffBreakInput } from '@/features/calendar-scheduling/types/staff-break';
import { createBooking } from '@/features/booking-management/api/booking-management-api';
import type { CreateBookingInput } from '@/features/booking-management/types/booking.schema';

function invalidateCalendar(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['calendar-scheduling'] });
  void queryClient.invalidateQueries({ queryKey: ['booking-management'] });
}

export { checkHolidayConflicts } from '@/features/calendar-scheduling/api/calendar-scheduling-api';

export function useCalendarEventsQuery(params: CalendarEventsParams) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'events', params],
    queryFn: () => getCalendarEvents(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(params.shopId && params.rangeStart && params.rangeEnd),
  });
}

export function useHolidaysQuery(shopId: string) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'holidays', shopId],
    queryFn: () => getHolidays(shopId),
    enabled: Boolean(shopId),
  });
}

export function useBlockedSlotsQuery(shopId: string) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'blocked', shopId],
    queryFn: () => getBlockedSlots(shopId),
    enabled: Boolean(shopId),
  });
}

export function useRecurringPatternsQuery(shopId: string, staffId?: string) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'recurring', shopId, staffId],
    queryFn: () => getRecurringPatterns(shopId, staffId),
    enabled: Boolean(shopId),
  });
}

export function useHolidayConflictsQuery(
  shopId: string,
  startDate: string,
  endDate: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'holiday-conflicts', shopId, startDate, endDate],
    queryFn: () => checkHolidayConflicts(shopId, startDate, endDate),
    enabled: enabled && Boolean(shopId && startDate && endDate),
  });
}

export function useCreateHolidayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHolidayInput) => createHoliday(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useUpdateHolidayMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateHolidayInput) => updateHoliday(id, input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useDeleteHolidayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useCreateBlockedSlotMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBlockedSlotInput) => createBlockedSlot(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useUpdateBlockedSlotMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBlockedSlotInput) => updateBlockedSlot(id, input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useDeleteBlockedSlotMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlockedSlot(id),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useCreateRecurringPatternMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRecurringPatternInput) => createRecurringPattern(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useUpdateRecurringPatternMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRecurringPatternInput) => updateRecurringPattern(id, input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useDeleteRecurringPatternMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecurringPattern(id),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useAddPatternExceptionMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exception: PatternException) => addPatternException(id, exception),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function usePreviewBulkScheduleMutation() {
  return useMutation({
    mutationFn: (input: BulkScheduleInput) => previewBulkSchedule(input),
  });
}

export function useApplyBulkScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkScheduleInput) => applyBulkSchedule(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useCreateStaffBreakMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffBreakInput) => createStaffBreak(input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useUpdateStaffBreakMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStaffBreakInput) => updateStaffBreak(id, input),
    onSuccess: () => invalidateCalendar(queryClient),
  });
}

export function useStaffBreaksQuery(shopId: string, staffIds?: string[]) {
  return useQuery({
    queryKey: ['calendar-scheduling', 'breaks', shopId, staffIds],
    queryFn: () => getStaffBreaks(shopId, staffIds),
    enabled: Boolean(shopId),
  });
}
