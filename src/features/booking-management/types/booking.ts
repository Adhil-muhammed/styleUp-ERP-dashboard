import type { ApiListParams } from '@/shared/types/api';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus =
  | 'paid'
  | 'pending'
  | 'partially_paid'
  | 'failed'
  | 'refunded';

export type BookingKind = 'service' | 'package';

export type BookingListItem = {
  id: string;
  merchantId: string;
  shopName: string;
  customerId: string;
  customerName: string;
  staffId: string;
  staffName: string;
  kind: BookingKind;
  serviceName: string;
  packageName?: string;
  status: BookingStatus;
  scheduledAt: string;
  paymentStatus: PaymentStatus;
  amount: number;
};

export type BookingListParams = ApiListParams & {
  merchantId?: string | null;
  status?: BookingStatus;
  upcoming?: boolean;
  shopId?: string;
  staffId?: string;
  dateFrom?: string;
  dateTo?: string;
  customerSearch?: string;
  paymentStatus?: PaymentStatus;
  sortBy?: 'scheduledAt' | 'customerName' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
};

export const BOOKING_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  'paid',
  'pending',
  'partially_paid',
  'failed',
  'refunded',
];
