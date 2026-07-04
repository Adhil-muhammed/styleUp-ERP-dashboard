import type { WorkingHours } from '@/features/merchant-management/types/working-hours';

export const defaultWorkingHours: WorkingHours = {
  mon: { isClosed: false, openTime: '09:00', closeTime: '20:00' },
  tue: { isClosed: false, openTime: '09:00', closeTime: '20:00' },
  wed: { isClosed: false, openTime: '09:00', closeTime: '20:00' },
  thu: { isClosed: false, openTime: '09:00', closeTime: '20:00' },
  fri: { isClosed: false, openTime: '09:00', closeTime: '21:00' },
  sat: { isClosed: false, openTime: '10:00', closeTime: '21:00' },
  sun: { isClosed: true, openTime: null, closeTime: null },
};

export const shopWorkingHoursFixture: Record<string, WorkingHours> = {
  'shp-001': defaultWorkingHours,
};

export function getWorkingHoursForShop(shopId: string): WorkingHours {
  return shopWorkingHoursFixture[shopId] ?? structuredClone(defaultWorkingHours);
}
