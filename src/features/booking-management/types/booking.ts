export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type BookingListItem = {
  id: string;
  merchantId: string;
  shopName: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  status: BookingStatus;
  scheduledAt: string;
  paymentStatus: PaymentStatus;
  amount: number;
};
