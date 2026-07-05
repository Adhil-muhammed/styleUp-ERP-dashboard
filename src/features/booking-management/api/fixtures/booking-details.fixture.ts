import type { BookingDetail } from '@/features/booking-management/types/booking-detail';

type BookingDetailExtras = Omit<
  BookingDetail,
  keyof import('@/features/booking-management/types/booking').BookingListItem
>;

function serviceDetail(
  name: string,
  category: string,
  durationMinutes: number,
  price: number,
): NonNullable<BookingDetail['service']> {
  return { name, category, durationMinutes, price };
}

function packageDetail(
  name: string,
  includedServices: { name: string; durationMinutes: number }[],
): NonNullable<BookingDetail['package']> {
  return { name, includedServices };
}

function payment(
  amount: number,
  method: string,
  status: BookingDetail['payment']['status'],
  transactionId?: string,
): BookingDetail['payment'] {
  return { amount, method, status, transactionId };
}

export const bookingDetailsFixture: Record<string, BookingDetailExtras> = {
  'bkg-001': {
    customerPhone: '+91 98470 12345',
    service: serviceDetail('Haircut & Styling', 'Hair', 45, 850),
    timeline: [
      { type: 'created', at: '2026-07-08T10:00:00Z' },
      { type: 'confirmed', at: '2026-07-08T10:15:00Z' },
    ],
    payment: payment(850, 'UPI', 'paid', 'TXN-BKG001-8842'),
    internalNotes: 'Regular customer — prefers Sreeja.',
    customerNotes: 'Please use mild products.',
  },
  'bkg-002': {
    customerPhone: '+91 98471 23456',
    service: serviceDetail('Beard Trim', 'Grooming', 20, 350),
    timeline: [
      { type: 'created', at: '2026-07-03T08:00:00Z' },
      { type: 'confirmed', at: '2026-07-03T08:10:00Z' },
      { type: 'completed', at: '2026-07-04T11:45:00Z' },
    ],
    payment: payment(350, 'Cash', 'paid', 'TXN-BKG002-3310'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-003': {
    customerPhone: '+91 98472 34567',
    service: serviceDetail('Facial Treatment', 'Skin Care', 60, 1200),
    timeline: [{ type: 'created', at: '2026-07-10T14:00:00Z' }],
    payment: payment(1200, 'Card', 'pending'),
    internalNotes: 'Awaiting confirmation call.',
    customerNotes: 'Sensitive skin — patch test required.',
  },
  'bkg-004': {
    customerPhone: '+91 98474 56789',
    service: serviceDetail('Hair Colour', 'Hair', 120, 2500),
    timeline: [
      { type: 'created', at: '2026-07-09T09:00:00Z' },
      { type: 'confirmed', at: '2026-07-09T09:30:00Z' },
    ],
    payment: payment(2500, 'UPI', 'paid', 'TXN-BKG004-9921'),
    internalNotes: '',
    customerNotes: 'Auburn shade preferred.',
  },
  'bkg-005': {
    customerPhone: '+91 98475 67890',
    service: serviceDetail('Manicure', 'Nails', 40, 600),
    timeline: [
      { type: 'created', at: '2026-06-27T11:00:00Z' },
      { type: 'confirmed', at: '2026-06-27T11:20:00Z' },
      { type: 'cancelled', at: '2026-06-28T08:00:00Z', note: 'Customer travel conflict' },
    ],
    payment: payment(600, 'UPI', 'refunded', 'TXN-BKG005-4412'),
    internalNotes: 'Refund processed same day.',
    customerNotes: '',
  },
  'bkg-006': {
    customerPhone: '+91 98473 45678',
    service: serviceDetail('Haircut & Styling', 'Hair', 45, 850),
    timeline: [
      { type: 'created', at: '2026-07-02T16:00:00Z' },
      { type: 'confirmed', at: '2026-07-02T16:05:00Z' },
      { type: 'completed', at: '2026-07-03T10:15:00Z' },
    ],
    payment: payment(850, 'Card', 'paid', 'TXN-BKG006-7720'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-007': {
    customerPhone: '+91 98476 78901',
    package: packageDetail('Bridal Glow Package', [
      { name: 'Facial Treatment', durationMinutes: 60 },
      { name: 'Hair Spa', durationMinutes: 90 },
      { name: 'Manicure & Pedicure', durationMinutes: 75 },
    ]),
    timeline: [
      { type: 'created', at: '2026-07-12T10:00:00Z' },
      { type: 'confirmed', at: '2026-07-12T11:00:00Z' },
    ],
    payment: payment(4500, 'Bank Transfer', 'partially_paid', 'TXN-BKG007-1100'),
    internalNotes: 'Balance due on appointment day.',
    customerNotes: 'Wedding on July 20.',
  },
  'bkg-008': {
    customerPhone: '+91 98477 89012',
    service: serviceDetail('Threading', 'Skin Care', 15, 200),
    timeline: [
      { type: 'created', at: '2026-06-30T12:00:00Z' },
      { type: 'confirmed', at: '2026-06-30T12:30:00Z' },
      { type: 'no_show', at: '2026-07-01T13:30:00Z', note: 'Did not arrive' },
    ],
    payment: payment(200, 'UPI', 'paid', 'TXN-BKG008-2201'),
    internalNotes: 'Follow up for rebooking.',
    customerNotes: '',
  },
  'bkg-009': {
    customerPhone: '+91 98478 90123',
    service: serviceDetail('Hair Spa', 'Hair', 75, 1800),
    timeline: [{ type: 'created', at: '2026-07-11T08:00:00Z' }],
    payment: payment(1800, 'Cash', 'pending'),
    internalNotes: '',
    customerNotes: 'Prefer morning slot.',
  },
  'bkg-010': {
    customerPhone: '+91 98479 01234',
    service: serviceDetail('Premium Haircut', 'Hair', 50, 950),
    timeline: [
      { type: 'created', at: '2026-07-06T14:00:00Z' },
      { type: 'confirmed', at: '2026-07-06T14:20:00Z' },
    ],
    payment: payment(950, 'UPI', 'paid', 'TXN-BKG010-5500'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-011': {
    customerPhone: '+91 98480 12340',
    package: packageDetail('Party Ready Combo', [
      { name: 'Hair Styling', durationMinutes: 45 },
      { name: 'Makeup', durationMinutes: 60 },
      { name: 'Manicure', durationMinutes: 40 },
    ]),
    timeline: [
      { type: 'created', at: '2026-07-01T09:00:00Z' },
      { type: 'confirmed', at: '2026-07-01T09:15:00Z' },
      { type: 'completed', at: '2026-07-02T18:30:00Z' },
    ],
    payment: payment(3200, 'Card', 'paid', 'TXN-BKG011-8800'),
    internalNotes: '',
    customerNotes: 'Evening party look.',
  },
  'bkg-012': {
    customerPhone: '+91 98481 23401',
    service: serviceDetail('Head Massage', 'Wellness', 30, 500),
    timeline: [
      { type: 'created', at: '2026-07-04T11:00:00Z' },
      { type: 'confirmed', at: '2026-07-04T11:30:00Z' },
    ],
    payment: payment(500, 'UPI', 'partially_paid', 'TXN-BKG012-3300'),
    internalNotes: 'Collect balance at checkout.',
    customerNotes: '',
  },
  'bkg-013': {
    customerPhone: '+91 98482 34012',
    service: serviceDetail('Beard Styling', 'Grooming', 25, 450),
    timeline: [{ type: 'created', at: '2026-07-12T07:00:00Z' }],
    payment: payment(450, 'Cash', 'pending'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-014': {
    customerPhone: '+91 98483 40123',
    service: serviceDetail('Kids Haircut', 'Hair', 25, 300),
    timeline: [
      { type: 'created', at: '2026-06-29T10:00:00Z' },
      { type: 'confirmed', at: '2026-06-29T10:30:00Z' },
      { type: 'cancelled', at: '2026-06-30T09:00:00Z', note: 'Child unwell' },
    ],
    payment: payment(300, 'UPI', 'refunded', 'TXN-BKG014-9900'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-015': {
    customerPhone: '+91 98484 01234',
    service: serviceDetail('Beard Trim', 'Grooming', 20, 350),
    timeline: [
      { type: 'created', at: '2026-07-04T18:00:00Z' },
      { type: 'confirmed', at: '2026-07-04T18:10:00Z' },
      { type: 'completed', at: '2026-07-05T09:00:00Z' },
    ],
    payment: payment(350, 'Cash', 'paid', 'TXN-BKG015-1122'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-016': {
    customerPhone: '+91 98485 12345',
    package: packageDetail('Grooming Essentials', [
      { name: 'Haircut', durationMinutes: 40 },
      { name: 'Beard Trim', durationMinutes: 20 },
      { name: 'Face Cleanup', durationMinutes: 30 },
    ]),
    timeline: [{ type: 'created', at: '2026-07-14T13:00:00Z' }],
    payment: payment(2100, 'UPI', 'pending'),
    internalNotes: 'New customer referral.',
    customerNotes: 'First visit.',
  },
  'bkg-017': {
    customerPhone: '+91 98486 23456',
    service: serviceDetail('Pedicure', 'Nails', 45, 750),
    timeline: [
      { type: 'created', at: '2026-07-07T08:00:00Z' },
      { type: 'confirmed', at: '2026-07-07T08:30:00Z' },
    ],
    payment: payment(750, 'Card', 'paid', 'TXN-BKG017-4455'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-018': {
    customerPhone: '+91 98487 34567',
    service: serviceDetail('Hair Colour', 'Hair', 120, 2200),
    timeline: [
      { type: 'created', at: '2026-06-28T14:00:00Z' },
      { type: 'confirmed', at: '2026-06-28T14:30:00Z' },
      { type: 'no_show', at: '2026-06-29T10:30:00Z', note: 'No response to calls' },
    ],
    payment: payment(2200, 'Card', 'failed'),
    internalNotes: 'Payment failed — follow up.',
    customerNotes: '',
  },
  'bkg-019': {
    customerPhone: '+91 98488 45678',
    service: serviceDetail('Facial Treatment', 'Skin Care', 60, 1100),
    timeline: [
      { type: 'created', at: '2026-07-05T10:00:00Z' },
      { type: 'confirmed', at: '2026-07-05T10:20:00Z' },
    ],
    payment: payment(1100, 'UPI', 'paid', 'TXN-BKG019-6677'),
    internalNotes: '',
    customerNotes: 'Allergic to fragrance.',
  },
  'bkg-020': {
    customerPhone: '+91 98489 56789',
    service: serviceDetail('Waxing', 'Skin Care', 35, 900),
    timeline: [
      { type: 'created', at: '2026-07-04T12:00:00Z' },
      { type: 'confirmed', at: '2026-07-04T12:15:00Z' },
      { type: 'completed', at: '2026-07-05T14:45:00Z' },
    ],
    payment: payment(900, 'Cash', 'paid', 'TXN-BKG020-7788'),
    internalNotes: '',
    customerNotes: '',
  },
  'bkg-021': {
    customerPhone: '+91 98490 67890',
    package: packageDetail('Spa Day Deluxe', [
      { name: 'Full Body Massage', durationMinutes: 90 },
      { name: 'Facial Treatment', durationMinutes: 60 },
      { name: 'Hair Spa', durationMinutes: 75 },
    ]),
    timeline: [
      { type: 'created', at: '2026-07-15T09:00:00Z' },
      { type: 'confirmed', at: '2026-07-15T10:00:00Z' },
    ],
    payment: payment(5500, 'Bank Transfer', 'partially_paid', 'TXN-BKG021-9900'),
    internalNotes: 'VIP customer — complimentary beverage.',
    customerNotes: 'Anniversary celebration.',
  },
  'bkg-022': {
    customerPhone: '+91 98491 78901',
    service: serviceDetail('Manicure', 'Nails', 40, 600),
    timeline: [{ type: 'created', at: '2026-07-16T11:00:00Z' }],
    payment: payment(600, 'UPI', 'pending'),
    internalNotes: '',
    customerNotes: '',
  },
};
