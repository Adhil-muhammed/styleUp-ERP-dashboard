import type { PaymentListItem } from '@/features/payments/types/payment';
import type { RefundRecord } from '@/features/payments/types/refund';

export type PaymentStatusTimelineEntry = {
  status: string;
  at: string;
  note?: string;
};

export type PaymentBookingSummary = {
  bookingId: string;
  bookingRef: string;
  serviceName: string;
  scheduledAt: string;
  bookingStatus: string;
};

export type PaymentDetail = PaymentListItem & {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  gatewayTransactionId: string;
  upiIntentUrl?: string;
  booking: PaymentBookingSummary;
  statusTimeline: PaymentStatusTimelineEntry[];
  refunds: RefundRecord[];
  rawGatewayResponse: Record<string, unknown>;
};
