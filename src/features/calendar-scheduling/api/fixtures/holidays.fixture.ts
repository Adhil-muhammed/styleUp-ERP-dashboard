import type { Holiday } from '@/features/calendar-scheduling/types/holiday';

export const holidaysFixture: Holiday[] = [
  {
    id: 'hol-001',
    scope: 'shop',
    shopId: 'shp-001',
    name: 'Shop Maintenance',
    startDate: '2026-07-20',
    endDate: '2026-07-20',
    recurringYearly: false,
  },
  {
    id: 'hol-002',
    scope: 'shop',
    shopId: 'shp-001',
    name: 'Onam',
    startDate: '2026-09-04',
    endDate: '2026-09-06',
    recurringYearly: true,
  },
  {
    id: 'hol-003',
    scope: 'staff',
    shopId: 'shp-001',
    staffId: 'stf-001',
    name: 'Personal Leave',
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    recurringYearly: false,
  },
  {
    id: 'hol-004',
    scope: 'shop',
    shopId: 'shp-002',
    name: 'Renovation',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    recurringYearly: false,
  },
];
