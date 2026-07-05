import type { StaffBreak } from '@/features/calendar-scheduling/types/staff-break';

export const staffBreaksFixture: StaffBreak[] = [
  {
    id: 'brk-001',
    shopId: 'shp-001',
    staffId: 'stf-001',
    start: '2026-07-07T07:00:00Z',
    end: '2026-07-07T08:00:00Z',
    label: 'Lunch break',
  },
  {
    id: 'brk-002',
    shopId: 'shp-001',
    staffId: 'stf-003',
    start: '2026-07-07T07:30:00Z',
    end: '2026-07-07T08:30:00Z',
    label: 'Lunch break',
  },
  {
    id: 'brk-003',
    shopId: 'shp-002',
    staffId: 'stf-011',
    start: '2026-07-08T06:30:00Z',
    end: '2026-07-08T07:30:00Z',
    label: 'Break',
  },
];
