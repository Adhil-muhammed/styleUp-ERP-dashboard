import type { ShopListItem } from '@/features/merchant-management/types/shop';

export type ShopProfile = ShopListItem & {
  email: string;
  phone: string;
  address: string;
  description: string;
  rejectionReason?: string;
  suspensionReason?: string;
  joinDate: string;
  totalBookings: number;
  totalRevenue: number;
};
