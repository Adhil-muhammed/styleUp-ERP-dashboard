import type { ApiListParams } from '@/shared/types/api';

export type ShopProfileTab =
  | 'general-information'
  | 'working-hours'
  | 'gallery'
  | 'services'
  | 'packages'
  | 'staff'
  | 'bookings'
  | 'reviews'
  | 'performance'
  | 'audit-history';

export const SHOP_PROFILE_TABS: ShopProfileTab[] = [
  'general-information',
  'working-hours',
  'gallery',
  'services',
  'packages',
  'staff',
  'bookings',
  'reviews',
  'performance',
  'audit-history',
];

export type ShopGalleryImage = {
  id: string;
  url: string;
  alt?: string;
  uploadedAt: string;
};

export type ShopService = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

export type ShopPackage = {
  id: string;
  name: string;
  servicesCount: number;
  price: number;
  isActive: boolean;
};

export type ShopStaffMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
  isActive: boolean;
};

export type ShopBooking = {
  id: string;
  customerName: string;
  serviceName: string;
  status: string;
  scheduledAt: string;
  amount: number;
};

export type ShopReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ShopAuditLog = {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
};

export type ShopPerformancePoint = {
  date: string;
  bookings: number;
  revenue: number;
  rating: number;
};

export type ShopPerformanceMetrics = {
  period: 7 | 30;
  data: ShopPerformancePoint[];
};

export type ShopTabListParams = ApiListParams;

export type ShopTabData = {
  services: ShopService[];
  packages: ShopPackage[];
  staff: ShopStaffMember[];
  bookings: ShopBooking[];
  reviews: ShopReview[];
  auditLogs: ShopAuditLog[];
};
