import type { CustomerListItem } from '@/features/user-management/types/customer';

export type CustomerProfile = CustomerListItem & {
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  reviewCount: number;
  loyaltyPoints: number;
};
