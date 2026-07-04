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
