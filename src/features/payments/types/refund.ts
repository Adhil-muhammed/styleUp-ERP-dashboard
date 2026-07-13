export const REFUND_STATUSES = ['requested', 'processing', 'completed', 'failed'] as const;

export type RefundStatus = (typeof REFUND_STATUSES)[number];

export const REFUND_REASONS = [
  'customer_request',
  'duplicate',
  'service_issue',
  'other',
] as const;

export type RefundReason = (typeof REFUND_REASONS)[number];

export type RefundRecord = {
  id: string;
  paymentId: string;
  amountPaise: number;
  reason: RefundReason;
  note?: string;
  status: RefundStatus;
  requestedAt: string;
  completedAt?: string;
};
