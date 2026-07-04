import type { ApiListParams } from '@/shared/types/api';

export type CustomerProfileTab =
  | 'overview'
  | 'bookings'
  | 'payments'
  | 'reviews'
  | 'notifications'
  | 'loyalty'
  | 'audit-logs';

export const CUSTOMER_PROFILE_TABS: CustomerProfileTab[] = [
  'overview',
  'bookings',
  'payments',
  'reviews',
  'notifications',
  'loyalty',
  'audit-logs',
];

export type CustomerBooking = {
  id: string;
  shopName: string;
  serviceName: string;
  status: string;
  scheduledAt: string;
  amount: number;
};

export type CustomerPayment = {
  id: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
};

export type CustomerReview = {
  id: string;
  shopName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CustomerNotification = {
  id: string;
  channel: string;
  title: string;
  sentAt: string;
  status: string;
};

export type CustomerLoyaltyEntry = {
  id: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  createdAt: string;
};

export type CustomerAuditLog = {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
};

export type CustomerTabListParams = ApiListParams;

export type CustomerTabData = {
  bookings: CustomerBooking[];
  payments: CustomerPayment[];
  reviews: CustomerReview[];
  notifications: CustomerNotification[];
  loyalty: CustomerLoyaltyEntry[];
  auditLogs: CustomerAuditLog[];
};
