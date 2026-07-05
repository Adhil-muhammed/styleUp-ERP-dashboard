import type { DayOfWeek } from '@/features/merchant-management/types/working-hours';

export type DayTimeRange = {
  openTime: string;
  closeTime: string;
};

export type RecurringDaySchedule = {
  day: DayOfWeek;
  ranges: DayTimeRange[];
};

export type PatternException = {
  date: string;
  isUnavailable: boolean;
  ranges?: DayTimeRange[];
  note?: string;
};

export type RecurringPattern = {
  id: string;
  shopId: string;
  staffId: string;
  label: string;
  effectiveFrom: string;
  effectiveTo?: string;
  schedule: RecurringDaySchedule[];
  exceptions: PatternException[];
};

export type CreateRecurringPatternInput = Omit<RecurringPattern, 'id' | 'exceptions'> & {
  exceptions?: PatternException[];
};
export type UpdateRecurringPatternInput = Partial<Omit<RecurringPattern, 'id'>>;
