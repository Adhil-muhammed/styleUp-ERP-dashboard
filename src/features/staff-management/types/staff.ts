import type { ApiListParams } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

export type StaffAvailability = 'available' | 'busy' | 'off';

export type StaffStatus = 'active' | 'inactive';

export const STAFF_ROLES = [
  'senior_stylist',
  'stylist',
  'barber',
  'beautician',
  'receptionist',
  'manager',
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export type StaffListItem = {
  id: string;
  merchantId: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  rating: number;
  availability: StaffAvailability;
  status: StaffStatus;
};

export type StaffListParams = ApiListParams & {
  merchantId?: string | null;
  role?: StaffRole;
  status?: StaffStatus;
  availability?: StaffAvailability;
  sortBy?: keyof Pick<
    StaffListItem,
    'name' | 'shopName' | 'role' | 'rating' | 'availability' | 'status'
  >;
};

export type StaffListResponse = PaginatedResponse<StaffListItem>;

export type AssignStaffShopInput = {
  merchantId: string;
};
