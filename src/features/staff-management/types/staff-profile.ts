import type { StaffAvailability, StaffRole, StaffStatus } from '@/features/staff-management/types/staff';

export type StaffProfile = {
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
  bio: string;
  joinedAt: string;
  skillIds: string[];
};
