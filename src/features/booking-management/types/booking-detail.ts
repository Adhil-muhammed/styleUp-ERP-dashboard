import type {
  BookingKind,
  BookingListItem,
  BookingStatus,
  PaymentStatus,
} from '@/features/booking-management/types/booking';

export type BookingTimelineEventType =
  | 'created'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingTimelineEvent = {
  type: BookingTimelineEventType;
  at: string;
  note?: string;
};

export type BookingServiceInfo = {
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
};

export type BookingPackageServiceItem = {
  name: string;
  durationMinutes: number;
};

export type BookingPackageInfo = {
  name: string;
  includedServices: BookingPackageServiceItem[];
};

export type BookingPaymentInfo = {
  amount: number;
  method: string;
  status: PaymentStatus;
  transactionId?: string;
};

export type BookingDetail = BookingListItem & {
  customerPhone: string;
  customerAvatarUrl?: string;
  service?: BookingServiceInfo;
  package?: BookingPackageInfo;
  timeline: BookingTimelineEvent[];
  payment: BookingPaymentInfo;
  internalNotes: string;
  customerNotes: string;
  kind: BookingKind;
  status: BookingStatus;
};
