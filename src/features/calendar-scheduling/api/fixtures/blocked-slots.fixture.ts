import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';

export const blockedSlotsFixture: BlockedSlot[] = [
  {
    id: 'blk-001',
    scope: 'shop',
    shopId: 'shp-001',
    start: '2026-07-08T06:00:00Z',
    end: '2026-07-08T09:00:00Z',
    reason: 'Equipment maintenance',
  },
  {
    id: 'blk-002',
    scope: 'staff',
    shopId: 'shp-001',
    staffId: 'stf-002',
    start: '2026-07-09T10:00:00Z',
    end: '2026-07-09T12:00:00Z',
    reason: 'Training session',
  },
  {
    id: 'blk-003',
    scope: 'shop',
    shopId: 'shp-002',
    start: '2026-07-11T14:00:00Z',
    end: '2026-07-11T16:00:00Z',
    reason: 'Private event',
  },
];
