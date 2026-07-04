import type { ShopListItem } from '@/features/merchant-management/types/shop';
import type { ShopProfile } from '@/features/merchant-management/types/shop-profile';

export const shopProfilesFixture: Record<string, ShopProfile> = {
  'shp-001': {
    id: 'shp-001',
    shopName: 'Luxe Salon Kochi',
    ownerName: 'Anjali Menon',
    rating: 4.8,
    status: 'approved',
    city: 'Kochi',
    activeServices: 24,
    activeStaff: 8,
    isFeatured: true,
    email: 'anjali@luxesalon.in',
    phone: '+91 98470 11111',
    address: 'MG Road, Kochi, Kerala 682011',
    description: 'Premium salon offering hair, skin, and bridal services in the heart of Kochi.',
    joinDate: '2023-04-15T00:00:00Z',
    totalBookings: 1240,
    totalRevenue: 2850000,
  },
  'shp-004': {
    id: 'shp-004',
    shopName: 'Urban Cuts Kaloor',
    ownerName: 'Arjun Pillai',
    rating: 4.2,
    status: 'pending',
    city: 'Kaloor',
    activeServices: 12,
    activeStaff: 4,
    isFeatured: false,
    email: 'arjun@urbancuts.in',
    phone: '+91 98470 22222',
    address: 'Kaloor Junction, Kochi, Kerala 682017',
    description: 'Modern barbershop and grooming studio awaiting verification.',
    joinDate: '2026-06-20T00:00:00Z',
    totalBookings: 0,
    totalRevenue: 0,
  },
  'shp-006': {
    id: 'shp-006',
    shopName: 'Serene Spa Ernakulam',
    ownerName: 'Vivek Das',
    rating: 4.7,
    status: 'suspended',
    city: 'Ernakulam',
    activeServices: 15,
    activeStaff: 5,
    isFeatured: false,
    email: 'vivek@serenespa.in',
    phone: '+91 98470 33333',
    address: 'Marine Drive, Ernakulam, Kerala 682031',
    description: 'Full-service spa and wellness centre.',
    suspensionReason: 'Multiple customer complaints regarding hygiene standards.',
    joinDate: '2024-01-10T00:00:00Z',
    totalBookings: 580,
    totalRevenue: 920000,
  },
};

export function getProfileForShop(id: string, listItem: ShopListItem): ShopProfile {
  const existing = shopProfilesFixture[id];
  if (existing) {
    return { ...existing, ...listItem };
  }
  return {
    ...listItem,
    email: `${listItem.ownerName.split(' ')[0]?.toLowerCase() ?? 'owner'}@shop.in`,
    phone: '+91 98470 00000',
    address: `${listItem.city}, Kerala`,
    description: '',
    joinDate: '2025-01-01T00:00:00Z',
    totalBookings: listItem.activeServices * 20,
    totalRevenue: listItem.activeServices * 15000,
  };
}
