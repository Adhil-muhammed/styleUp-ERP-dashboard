import { z } from 'zod';

import { WorkingHoursSchema } from '@/features/merchant-management/types/working-hours';

export const HolidaySchema = z
  .object({
    scope: z.enum(['shop', 'staff']),
    shopId: z.string().min(1),
    staffId: z.string().optional(),
    name: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    recurringYearly: z.boolean(),
  })
  .refine(
    (data) => data.scope !== 'staff' || Boolean(data.staffId),
    { message: 'Staff is required for staff-scoped holidays', path: ['staffId'] },
  );

export type HolidayFormInput = z.infer<typeof HolidaySchema>;

export const BlockedSlotSchema = z
  .object({
    scope: z.enum(['shop', 'staff']),
    shopId: z.string().min(1),
    staffId: z.string().optional(),
    start: z.string().min(1),
    end: z.string().min(1),
    reason: z.string().min(1),
  })
  .refine(
    (data) => data.scope !== 'staff' || Boolean(data.staffId),
    { message: 'Staff is required for staff-scoped blocks', path: ['staffId'] },
  )
  .refine(
    (data) => new Date(data.end).getTime() > new Date(data.start).getTime(),
    { message: 'End must be after start', path: ['end'] },
  );

export type BlockedSlotFormInput = z.infer<typeof BlockedSlotSchema>;

const dayTimeRangeSchema = z.object({
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
});

export const RecurringPatternSchema = z.object({
  shopId: z.string().min(1),
  staffId: z.string().min(1),
  label: z.string().min(1),
  effectiveFrom: z.string().min(1),
  effectiveTo: z.string().optional(),
  schedule: z.array(
    z.object({
      day: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
      ranges: z.array(dayTimeRangeSchema).min(1),
    }),
  ).min(1),
});

export type RecurringPatternFormInput = z.infer<typeof RecurringPatternSchema>;

export const ManualBookingSchema = z.object({
  shopId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  staffId: z.string().min(1),
  serviceName: z.string().min(1),
  scheduledAt: z.string().min(1),
  durationMinutes: z.number().min(15).max(480),
  amount: z.number().min(0),
});

export type ManualBookingFormInput = z.infer<typeof ManualBookingSchema>;

export const BulkScheduleSchema = z.object({
  action: z.enum(['working-hours', 'holiday', 'blocked']),
  shopId: z.string().min(1),
  staffIds: z.array(z.string()).min(1),
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  workingHours: WorkingHoursSchema.optional(),
  holidayName: z.string().optional(),
  blockedReason: z.string().optional(),
});

export type BulkScheduleFormInput = z.infer<typeof BulkScheduleSchema>;
