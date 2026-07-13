export const TRANSACTION_STATUSES = [
  'pending',
  'success',
  'failed',
  'refunded',
  'partially_refunded',
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'wallet'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_GATEWAYS = ['razorpay'] as const;

export type PaymentGateway = (typeof PAYMENT_GATEWAYS)[number];

export type PaymentListItem = {
  id: string;
  bookingId: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  amountPaise: number;
  refundedAmountPaise: number;
  method: PaymentMethod;
  gateway: PaymentGateway;
  status: TransactionStatus;
  createdAt: string;
  deletedAt: string | null;
};

export type PaymentListParams = {
  cursor?: string | null;
  limit?: number;
  search?: string;
  status?: TransactionStatus;
  method?: PaymentMethod;
  shopId?: string;
  merchantId?: string | null;
  dateFrom?: string;
  dateTo?: string;
  amountMinPaise?: number;
  amountMaxPaise?: number;
  sortBy?: 'createdAt' | 'amountPaise';
  sortOrder?: 'asc' | 'desc';
};
