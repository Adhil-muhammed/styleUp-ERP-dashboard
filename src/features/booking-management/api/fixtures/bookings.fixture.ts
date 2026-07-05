import type { BookingListItem } from '@/features/booking-management/types/booking';

const shopNames: Record<string, string> = {
  'shp-001': 'Luxe Salon Kochi',
  'shp-002': 'Glow Studio Edappally',
  'shp-003': 'StyleQuest MG Road',
  'shp-004': 'Urban Cuts Kaloor',
};

function booking(
  id: string,
  merchantId: keyof typeof shopNames,
  customerId: string,
  customerName: string,
  staffId: string,
  staffName: string,
  kind: BookingListItem['kind'],
  serviceName: string,
  status: BookingListItem['status'],
  scheduledAt: string,
  paymentStatus: BookingListItem['paymentStatus'],
  amount: number,
  packageName?: string,
): BookingListItem {
  return {
    id,
    merchantId,
    shopName: shopNames[merchantId],
    customerId,
    customerName,
    staffId,
    staffName,
    kind,
    serviceName,
    packageName,
    status,
    scheduledAt,
    paymentStatus,
    amount,
  };
}

export const bookingsFixture: BookingListItem[] = [
  booking('bkg-001', 'shp-001', 'usr-001', 'Ananya Nair', 'stf-001', 'Sreeja K', 'service', 'Haircut & Styling', 'confirmed', '2026-07-10T14:30:00Z', 'paid', 850),
  booking('bkg-002', 'shp-001', 'usr-002', 'Rahul Menon', 'stf-002', 'Jithin M', 'service', 'Beard Trim', 'completed', '2026-07-04T11:00:00Z', 'paid', 350),
  booking('bkg-003', 'shp-001', 'usr-003', 'Priya Thomas', 'stf-003', 'Arya P', 'service', 'Facial Treatment', 'pending', '2026-07-12T16:00:00Z', 'pending', 1200),
  booking('bkg-004', 'shp-002', 'usr-005', 'Meera Krishnan', 'stf-011', 'Lakshmi Suresh', 'service', 'Hair Colour', 'confirmed', '2026-07-11T10:00:00Z', 'paid', 2500),
  booking('bkg-005', 'shp-002', 'usr-006', 'Vivek Das', 'stf-009', 'Neha Sharma', 'service', 'Manicure', 'cancelled', '2026-06-28T15:00:00Z', 'refunded', 600),
  booking('bkg-006', 'shp-002', 'usr-004', 'Arjun Pillai', 'stf-007', 'Divya Ramesh', 'service', 'Haircut & Styling', 'completed', '2026-07-03T09:30:00Z', 'paid', 850),
  booking('bkg-007', 'shp-001', 'usr-007', 'Deepa Suresh', 'stf-005', 'Meera Nair', 'package', 'Bridal Glow Package', 'confirmed', '2026-07-15T11:00:00Z', 'partially_paid', 4500, 'Bridal Glow Package'),
  booking('bkg-008', 'shp-003', 'usr-008', 'Sanjay Kumar', 'stf-013', 'Reshma Paul', 'service', 'Threading', 'no_show', '2026-07-01T13:00:00Z', 'paid', 200),
  booking('bkg-009', 'shp-003', 'usr-009', 'Lakshmi Menon', 'stf-012', 'Priya Thomas', 'service', 'Hair Spa', 'pending', '2026-07-14T15:30:00Z', 'pending', 1800),
  booking('bkg-010', 'shp-004', 'usr-010', 'George Mathew', 'stf-017', 'Manu Jose', 'service', 'Premium Haircut', 'confirmed', '2026-07-08T10:00:00Z', 'paid', 950),
  booking('bkg-011', 'shp-004', 'usr-011', 'Christy John', 'stf-018', 'Sneha Raj', 'package', 'Party Ready Combo', 'completed', '2026-07-02T17:00:00Z', 'paid', 3200, 'Party Ready Combo'),
  booking('bkg-012', 'shp-001', 'usr-012', 'Faisal Khan', 'stf-006', 'Arun Das', 'service', 'Head Massage', 'confirmed', '2026-07-06T09:00:00Z', 'partially_paid', 500),
  booking('bkg-013', 'shp-002', 'usr-013', 'Reshma Paul', 'stf-008', 'Harish Kumar', 'service', 'Beard Styling', 'pending', '2026-07-13T12:00:00Z', 'pending', 450),
  booking('bkg-014', 'shp-003', 'usr-014', 'Tom Cherian', 'stf-015', 'George Mathew', 'service', 'Kids Haircut', 'cancelled', '2026-06-30T16:00:00Z', 'refunded', 300),
  booking('bkg-015', 'shp-004', 'usr-015', 'Neha Sharma', 'stf-019', 'Vivek Das', 'service', 'Beard Trim', 'completed', '2026-07-05T08:30:00Z', 'paid', 350),
  booking('bkg-016', 'shp-001', 'usr-016', 'Binu Raj', 'stf-001', 'Sreeja K', 'package', 'Grooming Essentials', 'pending', '2026-07-16T14:00:00Z', 'pending', 2100, 'Grooming Essentials'),
  booking('bkg-017', 'shp-002', 'usr-017', 'Amrita Das', 'stf-010', 'Tom Cherian', 'service', 'Pedicure', 'confirmed', '2026-07-09T11:30:00Z', 'paid', 750),
  booking('bkg-018', 'shp-003', 'usr-018', 'Kiran Varma', 'stf-014', 'George Mathew', 'service', 'Hair Colour', 'no_show', '2026-06-29T10:00:00Z', 'failed', 2200),
  booking('bkg-019', 'shp-004', 'usr-019', 'Manu Jose', 'stf-020', 'Amrita Das', 'service', 'Facial Treatment', 'confirmed', '2026-07-07T13:00:00Z', 'paid', 1100),
  booking('bkg-020', 'shp-001', 'usr-020', 'Sneha Raj', 'stf-003', 'Arya P', 'service', 'Waxing', 'completed', '2026-07-05T14:00:00Z', 'paid', 900),
  booking('bkg-021', 'shp-002', 'usr-021', 'Harish Kumar', 'stf-011', 'Lakshmi Suresh', 'package', 'Spa Day Deluxe', 'confirmed', '2026-07-17T10:30:00Z', 'partially_paid', 5500, 'Spa Day Deluxe'),
  booking('bkg-022', 'shp-003', 'usr-022', 'Divya Ramesh', 'stf-016', 'Christy John', 'service', 'Manicure', 'pending', '2026-07-18T16:30:00Z', 'pending', 600),
];
