import type { DashboardKpis } from '@/features/dashboard/types/dashboard-kpis';

export const dashboardKpisFixture: DashboardKpis = {
  totalCustomers: { value: 12_450, trend: { value: 8.2, direction: 'up' } },
  activeCustomers: { value: 3_820, trend: { value: 4.1, direction: 'up' } },
  totalShops: { value: 186, trend: { value: 2.5, direction: 'up' } },
  activeShops: { value: 142, trend: { value: 1.2, direction: 'neutral' } },
  todaysBookings: { value: 247, trend: { value: 12.4, direction: 'up' } },
  upcomingBookings: { value: 1_034, trend: { value: 6.8, direction: 'up' } },
  cancelledBookings: { value: 18, trend: { value: 3.1, direction: 'down' } },
  revenueToday: { value: 1_85_400, trend: { value: 9.5, direction: 'up' } },
  revenueThisMonth: { value: 42_75_000, trend: { value: 11.2, direction: 'up' } },
  averageRating: { value: 4.6, trend: { value: 0.3, direction: 'up' } },
  activePromotions: { value: 23, trend: { value: 5.0, direction: 'down' } },
};

export const shopDashboardKpisFixture: Record<string, DashboardKpis> = {
  'shp-001': {
    totalCustomers: { value: 420, trend: { value: 3.2, direction: 'up' } },
    activeCustomers: { value: 186, trend: { value: 2.1, direction: 'up' } },
    totalShops: { value: 1, trend: { value: 0, direction: 'neutral' } },
    activeShops: { value: 1, trend: { value: 0, direction: 'neutral' } },
    todaysBookings: { value: 18, trend: { value: 5.4, direction: 'up' } },
    upcomingBookings: { value: 64, trend: { value: 4.2, direction: 'up' } },
    cancelledBookings: { value: 2, trend: { value: 1.0, direction: 'down' } },
    revenueToday: { value: 24_500, trend: { value: 6.1, direction: 'up' } },
    revenueThisMonth: { value: 5_80_000, trend: { value: 8.4, direction: 'up' } },
    averageRating: { value: 4.8, trend: { value: 0.2, direction: 'up' } },
    activePromotions: { value: 2, trend: { value: 0, direction: 'neutral' } },
  },
  'shp-002': {
    totalCustomers: { value: 310, trend: { value: 2.8, direction: 'up' } },
    activeCustomers: { value: 142, trend: { value: 1.5, direction: 'up' } },
    totalShops: { value: 1, trend: { value: 0, direction: 'neutral' } },
    activeShops: { value: 1, trend: { value: 0, direction: 'neutral' } },
    todaysBookings: { value: 12, trend: { value: 3.1, direction: 'up' } },
    upcomingBookings: { value: 41, trend: { value: 2.6, direction: 'up' } },
    cancelledBookings: { value: 1, trend: { value: 0.5, direction: 'down' } },
    revenueToday: { value: 18_200, trend: { value: 4.8, direction: 'up' } },
    revenueThisMonth: { value: 4_20_000, trend: { value: 7.1, direction: 'up' } },
    averageRating: { value: 4.5, trend: { value: 0.1, direction: 'up' } },
    activePromotions: { value: 1, trend: { value: 0, direction: 'neutral' } },
  },
};

export function getShopDashboardKpis(merchantId: string): DashboardKpis {
  return shopDashboardKpisFixture[merchantId] ?? shopDashboardKpisFixture['shp-001'];
}
