import type { RecurringPattern } from '@/features/calendar-scheduling/types/recurring-availability';

export const recurringAvailabilityFixture: RecurringPattern[] = [
  {
    id: 'rec-001',
    shopId: 'shp-001',
    staffId: 'stf-001',
    label: 'Mon/Wed/Fri availability',
    effectiveFrom: '2026-07-01',
    effectiveTo: '2026-12-31',
    schedule: [
      {
        day: 'mon',
        ranges: [{ openTime: '09:00', closeTime: '18:00' }],
      },
      {
        day: 'wed',
        ranges: [{ openTime: '09:00', closeTime: '18:00' }],
      },
      {
        day: 'fri',
        ranges: [
          { openTime: '09:00', closeTime: '13:00' },
          { openTime: '14:00', closeTime: '18:00' },
        ],
      },
    ],
    exceptions: [
      {
        date: '2026-07-14',
        isUnavailable: true,
        note: 'Doctor appointment',
      },
    ],
  },
  {
    id: 'rec-002',
    shopId: 'shp-002',
    staffId: 'stf-011',
    label: 'Tue/Thu/Sat',
    effectiveFrom: '2026-07-01',
    schedule: [
      { day: 'tue', ranges: [{ openTime: '10:00', closeTime: '19:00' }] },
      { day: 'thu', ranges: [{ openTime: '10:00', closeTime: '19:00' }] },
      { day: 'sat', ranges: [{ openTime: '10:00', closeTime: '16:00' }] },
    ],
    exceptions: [],
  },
];
