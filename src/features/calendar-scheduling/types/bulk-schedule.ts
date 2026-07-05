import type { WorkingHours } from '@/features/merchant-management/types/working-hours';

export type BulkScheduleAction = 'working-hours' | 'holiday' | 'blocked';

export type BulkScheduleInput = {
  action: BulkScheduleAction;
  shopId: string;
  staffIds: string[];
  dateFrom: string;
  dateTo: string;
  workingHours?: WorkingHours;
  holidayName?: string;
  blockedReason?: string;
};

export type BulkSchedulePreview = {
  affectedStaffCount: number;
  affectedDateCount: number;
  totalEntries: number;
  sampleDates: string[];
};
