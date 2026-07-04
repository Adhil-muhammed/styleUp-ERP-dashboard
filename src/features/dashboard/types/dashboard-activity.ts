import type { PaginatedResponse } from '@/shared/types/common';

export type ActivityTab =
  | 'bookings'
  | 'registrations'
  | 'reviews'
  | 'refunds'
  | 'alerts';

export type DashboardActivityParams = {
  page?: number;
  pageSize?: number;
};

export type RecentBooking = {
  id: string;
  customerName: string;
  shopName: string;
  serviceName: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  scheduledAt: string;
};

export type RecentRegistration = {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'merchant';
  registeredAt: string;
};

export type RecentReview = {
  id: string;
  customerName: string;
  shopName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type RecentRefund = {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  requestedAt: string;
};

export type SystemAlert = {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
};

export type ActivityItemMap = {
  bookings: RecentBooking;
  registrations: RecentRegistration;
  reviews: RecentReview;
  refunds: RecentRefund;
  alerts: SystemAlert;
};

export type DashboardActivityResponse<T extends ActivityTab> = PaginatedResponse<
  ActivityItemMap[T]
>;
