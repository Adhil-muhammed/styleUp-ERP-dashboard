import type { CustomerTabData } from '@/features/user-management/types/customer-tabs';

const defaultTabData: CustomerTabData = {
  bookings: [
    {
      id: 'bkg-c001',
      shopName: 'Luxe Salon Kochi',
      serviceName: 'Haircut & Styling',
      status: 'completed',
      scheduledAt: '2026-06-28T14:30:00Z',
      amount: 850,
    },
    {
      id: 'bkg-c002',
      shopName: 'Glow Studio Edappally',
      serviceName: 'Facial Treatment',
      status: 'confirmed',
      scheduledAt: '2026-07-10T11:00:00Z',
      amount: 1200,
    },
    {
      id: 'bkg-c003',
      shopName: 'StyleQuest MG Road',
      serviceName: 'Hair Colour',
      status: 'cancelled',
      scheduledAt: '2026-06-15T16:00:00Z',
      amount: 2500,
    },
    {
      id: 'bkg-c004',
      shopName: 'Bloom Beauty Kakkanad',
      serviceName: 'Manicure',
      status: 'completed',
      scheduledAt: '2026-05-20T10:00:00Z',
      amount: 600,
    },
    {
      id: 'bkg-c005',
      shopName: 'Urban Cuts Kaloor',
      serviceName: 'Beard Trim',
      status: 'pending',
      scheduledAt: '2026-07-15T09:30:00Z',
      amount: 350,
    },
  ],
  payments: [
    {
      id: 'pay-c001',
      amount: 850,
      method: 'UPI',
      status: 'completed',
      paidAt: '2026-06-28T15:00:00Z',
    },
    {
      id: 'pay-c002',
      amount: 1200,
      method: 'Card',
      status: 'pending',
      paidAt: '2026-07-10T11:30:00Z',
    },
    {
      id: 'pay-c003',
      amount: 600,
      method: 'UPI',
      status: 'completed',
      paidAt: '2026-05-20T10:30:00Z',
    },
    {
      id: 'pay-c004',
      amount: 2500,
      method: 'Wallet',
      status: 'refunded',
      paidAt: '2026-06-15T16:30:00Z',
    },
  ],
  reviews: [
    {
      id: 'rev-c001',
      shopName: 'Luxe Salon Kochi',
      rating: 5,
      comment: 'Excellent service and friendly staff!',
      createdAt: '2026-06-29T10:00:00Z',
    },
    {
      id: 'rev-c002',
      shopName: 'Bloom Beauty Kakkanad',
      rating: 4,
      comment: 'Good experience, slightly long wait time.',
      createdAt: '2026-05-21T14:00:00Z',
    },
  ],
  notifications: [
    {
      id: 'ntf-c001',
      channel: 'push',
      title: 'Booking confirmed',
      sentAt: '2026-07-04T08:00:00Z',
      status: 'delivered',
    },
    {
      id: 'ntf-c002',
      channel: 'email',
      title: 'Payment receipt',
      sentAt: '2026-06-28T15:05:00Z',
      status: 'delivered',
    },
    {
      id: 'ntf-c003',
      channel: 'sms',
      title: 'Appointment reminder',
      sentAt: '2026-07-09T18:00:00Z',
      status: 'pending',
    },
  ],
  loyalty: [
    {
      id: 'loy-c001',
      type: 'earn',
      points: 85,
      description: 'Booking at Luxe Salon Kochi',
      createdAt: '2026-06-28T15:00:00Z',
    },
    {
      id: 'loy-c002',
      type: 'redeem',
      points: 200,
      description: 'Redeemed for discount coupon',
      createdAt: '2026-06-01T12:00:00Z',
    },
    {
      id: 'loy-c003',
      type: 'earn',
      points: 60,
      description: 'Booking at Bloom Beauty Kakkanad',
      createdAt: '2026-05-20T10:30:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'aud-c001',
      action: 'profile.updated',
      actor: 'customer',
      createdAt: '2026-06-10T09:00:00Z',
    },
    {
      id: 'aud-c002',
      action: 'password.reset_requested',
      actor: 'system',
      createdAt: '2026-05-15T14:30:00Z',
    },
    {
      id: 'aud-c003',
      action: 'login.success',
      actor: 'customer',
      createdAt: '2026-07-04T09:15:00Z',
    },
  ],
};

export const customerTabDataFixture: Record<string, CustomerTabData> = {
  'usr-001': defaultTabData,
  'usr-002': {
    ...defaultTabData,
    bookings: defaultTabData.bookings.slice(0, 2),
    payments: defaultTabData.payments.slice(0, 2),
  },
  'usr-003': {
    ...defaultTabData,
    bookings: [
      ...defaultTabData.bookings,
      {
        id: 'bkg-c006',
        shopName: 'Luxe Salon Kochi',
        serviceName: 'Bridal Makeup',
        status: 'completed',
        scheduledAt: '2026-04-10T08:00:00Z',
        amount: 15000,
      },
    ],
  },
};

export function getTabDataForCustomer(customerId: string): CustomerTabData {
  return customerTabDataFixture[customerId] ?? defaultTabData;
}

export { defaultTabData };
