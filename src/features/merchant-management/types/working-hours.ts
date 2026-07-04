import { z } from 'zod';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export type DaySchedule = {
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
};

export type WorkingHours = Record<DayOfWeek, DaySchedule>;

const dayScheduleSchema = z.object({
  isClosed: z.boolean(),
  openTime: z.string().nullable(),
  closeTime: z.string().nullable(),
});

export const WorkingHoursSchema = z.object({
  mon: dayScheduleSchema,
  tue: dayScheduleSchema,
  wed: dayScheduleSchema,
  thu: dayScheduleSchema,
  fri: dayScheduleSchema,
  sat: dayScheduleSchema,
  sun: dayScheduleSchema,
});
