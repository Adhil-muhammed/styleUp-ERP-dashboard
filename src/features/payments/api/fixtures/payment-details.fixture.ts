import { bookingsFixture } from '@/features/booking-management/api/fixtures/bookings.fixture';
import { paymentsFixture } from '@/features/payments/api/fixtures/payments.fixture';
import type { PaymentDetail } from '@/features/payments/types/payment-detail';
import type { RefundRecord } from '@/features/payments/types/refund';

function buildTimeline(payment: (typeof paymentsFixture)[number]): PaymentDetail['statusTimeline'] {
  const entries: PaymentDetail['statusTimeline'] = [
    { status: 'pending', at: payment.createdAt, note: 'Payment initiated' },
  ];

  if (payment.status === 'failed') {
    entries.push({
      status: 'failed',
      at: new Date(new Date(payment.createdAt).getTime() + 120_000).toISOString(),
      note: 'Gateway declined',
    });
    return entries;
  }

  if (payment.status !== 'pending') {
    entries.push({
      status: 'processing',
      at: new Date(new Date(payment.createdAt).getTime() + 30_000).toISOString(),
    });
    entries.push({
      status: 'success',
      at: new Date(new Date(payment.createdAt).getTime() + 90_000).toISOString(),
      note: 'Razorpay UPI Intent captured',
    });
  }

  if (payment.refundedAmountPaise > 0) {
    entries.push({
      status: payment.status === 'refunded' ? 'refunded' : 'partially_refunded',
      at: new Date(new Date(payment.createdAt).getTime() + 360_000).toISOString(),
      note: `Refunded ${payment.refundedAmountPaise / 100} INR`,
    });
  }

  return entries;
}

function buildRefunds(payment: (typeof paymentsFixture)[number]): RefundRecord[] {
  if (payment.refundedAmountPaise <= 0) {
    return [];
  }

  return [
    {
      id: `ref-${payment.id}`,
      paymentId: payment.id,
      amountPaise: payment.refundedAmountPaise,
      reason: payment.bookingId === 'bkg-005' ? 'customer_request' : 'service_issue',
      note: 'Processed via admin panel',
      status: 'completed',
      requestedAt: new Date(new Date(payment.createdAt).getTime() + 300_000).toISOString(),
      completedAt: new Date(new Date(payment.createdAt).getTime() + 360_000).toISOString(),
    },
  ];
}

function buildDetail(payment: (typeof paymentsFixture)[number]): PaymentDetail {
  const booking = bookingsFixture.find((item) => item.id === payment.bookingId);
  const suffix = payment.id.replace('pay-', '');

  return {
    ...payment,
    razorpayPaymentId: `pay_RZP${suffix.toUpperCase()}`,
    razorpayOrderId: `order_RZP${suffix.toUpperCase()}`,
    gatewayTransactionId: `TXN-${payment.bookingRef}-${suffix}`,
    upiIntentUrl:
      payment.method === 'upi'
        ? `upi://pay?pa=stylequest@razorpay&pn=StyleQuest&am=${payment.amountPaise / 100}&tr=${payment.id}`
        : undefined,
    booking: {
      bookingId: payment.bookingId,
      bookingRef: payment.bookingRef,
      serviceName: booking?.packageName ?? booking?.serviceName ?? 'Service',
      scheduledAt: booking?.scheduledAt ?? payment.createdAt,
      bookingStatus: booking?.status ?? 'confirmed',
    },
    statusTimeline: buildTimeline(payment),
    refunds: buildRefunds(payment),
    rawGatewayResponse: {
      id: `pay_RZP${suffix.toUpperCase()}`,
      entity: 'payment',
      amount: payment.amountPaise,
      currency: 'INR',
      status: payment.status === 'failed' ? 'failed' : 'captured',
      method: payment.method,
      order_id: `order_RZP${suffix.toUpperCase()}`,
      description: `Booking ${payment.bookingRef}`,
      vpa: payment.method === 'upi' ? 'customer@upi' : undefined,
      notes: { booking_id: payment.bookingId },
    },
  };
}

export const paymentDetailsFixture: Record<string, PaymentDetail> = Object.fromEntries(
  paymentsFixture
    .filter((payment) => payment.deletedAt === null)
    .map((payment) => [payment.id, buildDetail(payment)]),
);
