import type { ShopTabData } from '@/features/merchant-management/types/shop-tabs';

const defaultTabData: ShopTabData = {
  services: [
    { id: 'svc-001', name: 'Haircut & Styling', category: 'Hair', durationMinutes: 45, price: 850, isActive: true },
    { id: 'svc-002', name: 'Facial Treatment', category: 'Skin', durationMinutes: 60, price: 1200, isActive: true },
    { id: 'svc-003', name: 'Hair Colour', category: 'Hair', durationMinutes: 120, price: 2500, isActive: true },
    { id: 'svc-004', name: 'Manicure', category: 'Nails', durationMinutes: 30, price: 600, isActive: false },
    { id: 'svc-005', name: 'Beard Trim', category: 'Grooming', durationMinutes: 20, price: 350, isActive: true },
  ],
  packages: [
    { id: 'pkg-001', name: 'Bridal Glow Package', servicesCount: 5, price: 15000, isActive: true },
    { id: 'pkg-002', name: 'Weekend Refresh', servicesCount: 3, price: 3500, isActive: true },
    { id: 'pkg-003', name: 'Monthly Maintenance', servicesCount: 4, price: 4200, isActive: false },
  ],
  staff: [
    { id: 'stf-001', name: 'Sreeja K', role: 'Senior Stylist', phone: '+91 98470 10001', isActive: true },
    { id: 'stf-002', name: 'Jithin M', role: 'Barber', phone: '+91 98470 10002', isActive: true },
    { id: 'stf-003', name: 'Arya P', role: 'Beautician', phone: '+91 98470 10003', isActive: true },
    { id: 'stf-004', name: 'Renjith T', role: 'Receptionist', phone: '+91 98470 10004', isActive: false },
  ],
  bookings: [
    { id: 'bkg-s001', customerName: 'Ananya Nair', serviceName: 'Haircut & Styling', status: 'confirmed', scheduledAt: '2026-07-10T14:30:00Z', amount: 850 },
    { id: 'bkg-s002', customerName: 'Rahul Menon', serviceName: 'Beard Trim', status: 'completed', scheduledAt: '2026-07-04T11:00:00Z', amount: 350 },
    { id: 'bkg-s003', customerName: 'Priya Thomas', serviceName: 'Facial Treatment', status: 'pending', scheduledAt: '2026-07-12T16:00:00Z', amount: 1200 },
    { id: 'bkg-s004', customerName: 'Arjun Pillai', serviceName: 'Hair Colour', status: 'cancelled', scheduledAt: '2026-06-28T10:00:00Z', amount: 2500 },
  ],
  reviews: [
    { id: 'rev-s001', customerName: 'Ananya Nair', rating: 5, comment: 'Excellent service and friendly staff!', createdAt: '2026-06-29T10:00:00Z' },
    { id: 'rev-s002', customerName: 'Meera Krishnan', rating: 4, comment: 'Great haircut, slightly long wait.', createdAt: '2026-06-15T14:00:00Z' },
    { id: 'rev-s003', customerName: 'Vivek Das', rating: 5, comment: 'Best salon in Kochi!', createdAt: '2026-05-20T09:00:00Z' },
  ],
  auditLogs: [
    { id: 'aud-s001', action: 'shop.approved', actor: 'admin', createdAt: '2023-04-20T10:00:00Z' },
    { id: 'aud-s002', action: 'shop.featured', actor: 'admin', createdAt: '2024-06-01T12:00:00Z' },
    { id: 'aud-s003', action: 'profile.updated', actor: 'merchant', createdAt: '2026-03-10T09:00:00Z' },
  ],
};

export const shopTabDataFixture: Record<string, ShopTabData> = {
  'shp-001': defaultTabData,
  'shp-003': { ...defaultTabData, bookings: defaultTabData.bookings.slice(0, 2) },
};

export function getTabDataForShop(shopId: string): ShopTabData {
  return shopTabDataFixture[shopId] ?? defaultTabData;
}
