import { bookingsFixture } from '@/features/booking-management/api/fixtures/bookings.fixture';
import type {
  PaymentGateway,
  PaymentListItem,
  PaymentMethod,
  TransactionStatus,
} from '@/features/payments/types/payment';

function mapPaymentStatus(
  bookingPaymentStatus: string,
  refundedAmountPaise: number,
  amountPaise: number,
): TransactionStatus {
  if (refundedAmountPaise >= amountPaise && refundedAmountPaise > 0) {
    return 'refunded';
  }
  if (refundedAmountPaise > 0) {
    return 'partially_refunded';
  }
  switch (bookingPaymentStatus) {
    case 'paid':
    case 'partially_paid':
      return 'success';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'failed';
    case 'refunded':
      return 'refunded';
    default:
      return 'pending';
  }
}

function mapMethod(method: string): PaymentMethod {
  const normalized = method.toLowerCase();
  if (normalized.includes('upi')) return 'upi';
  if (normalized.includes('card')) return 'card';
  if (normalized.includes('bank') || normalized.includes('net')) return 'netbanking';
  if (normalized.includes('wallet')) return 'wallet';
  return 'upi';
}

function toBookingRef(bookingId: string): string {
  const numeric = bookingId.replace('bkg-', '');
  return `BKG-${numeric.padStart(3, '0')}`;
}

function paymentFromBooking(
  bookingId: string,
  methodOverride?: PaymentMethod,
  statusOverride?: TransactionStatus,
  refundedAmountPaise = 0,
  deletedAt: string | null = null,
  createdAtOffsetDays = 0,
): PaymentListItem {
  const booking = bookingsFixture.find((item) => item.id === bookingId);
  if (!booking) {
    throw new Error(`Booking not found for payment fixture: ${bookingId}`);
  }

  const amountPaise = booking.amount * 100;
  const method = methodOverride ?? mapMethod(
    booking.paymentStatus === 'paid' ? 'UPI' : booking.paymentStatus === 'failed' ? 'Card' : 'UPI',
  );
  const status =
    statusOverride ??
    mapPaymentStatus(booking.paymentStatus, refundedAmountPaise, amountPaise);

  const createdAt = new Date(booking.scheduledAt);
  createdAt.setDate(createdAt.getDate() - createdAtOffsetDays);

  return {
    id: `pay-${bookingId.replace('bkg-', '')}`,
    bookingId: booking.id,
    bookingRef: toBookingRef(booking.id),
    customerId: booking.customerId,
    customerName: booking.customerName,
    shopId: booking.merchantId,
    shopName: booking.shopName,
    amountPaise,
    refundedAmountPaise,
    method,
    gateway: 'razorpay' satisfies PaymentGateway,
    status,
    createdAt: createdAt.toISOString(),
    deletedAt,
  };
}

export const paymentsFixture: PaymentListItem[] = [
  paymentFromBooking('bkg-001'),
  paymentFromBooking('bkg-002', 'card'),
  paymentFromBooking('bkg-003', 'card', 'pending'),
  paymentFromBooking('bkg-004', 'upi'),
  paymentFromBooking('bkg-005', 'upi', 'refunded', 60000),
  paymentFromBooking('bkg-006', 'wallet'),
  paymentFromBooking('bkg-007', 'upi', 'partially_refunded', 225000),
  paymentFromBooking('bkg-008', 'upi'),
  paymentFromBooking('bkg-009', 'card', 'pending'),
  paymentFromBooking('bkg-010', 'netbanking'),
  paymentFromBooking('bkg-011', 'upi'),
  paymentFromBooking('bkg-012', 'upi', 'partially_refunded', 25000),
  paymentFromBooking('bkg-013', 'card', 'pending'),
  paymentFromBooking('bkg-014', 'upi', 'refunded', 30000),
  paymentFromBooking('bkg-015', 'wallet'),
  paymentFromBooking('bkg-016', 'card', 'pending'),
  paymentFromBooking('bkg-017', 'upi'),
  paymentFromBooking('bkg-018', 'card', 'failed'),
  paymentFromBooking('bkg-019', 'upi'),
  paymentFromBooking('bkg-020', 'netbanking'),
  paymentFromBooking('bkg-021', 'upi', 'success'),
  paymentFromBooking('bkg-022', 'wallet', 'pending'),
  {
    id: 'pay-soft-deleted',
    bookingId: 'bkg-099',
    bookingRef: 'BKG-099',
    customerId: 'usr-099',
    customerName: 'Deleted Transaction',
    shopId: 'shp-001',
    shopName: 'Luxe Salon Kochi',
    amountPaise: 150000,
    refundedAmountPaise: 0,
    method: 'upi',
    gateway: 'razorpay',
    status: 'success',
    createdAt: '2026-06-15T10:00:00.000Z',
    deletedAt: '2026-06-16T10:00:00.000Z',
  },
];
