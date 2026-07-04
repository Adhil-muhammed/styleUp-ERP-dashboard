export type KpiTrendDirection = 'up' | 'down' | 'neutral';

export type KpiTrend = {
  value: number;
  direction: KpiTrendDirection;
};

export type KpiMetric = {
  value: number;
  trend?: KpiTrend;
};

export type DashboardKpis = {
  totalCustomers: KpiMetric;
  activeCustomers: KpiMetric;
  totalShops: KpiMetric;
  activeShops: KpiMetric;
  todaysBookings: KpiMetric;
  upcomingBookings: KpiMetric;
  cancelledBookings: KpiMetric;
  revenueToday: KpiMetric;
  revenueThisMonth: KpiMetric;
  averageRating: KpiMetric;
  activePromotions: KpiMetric;
};

export type KpiKey = keyof DashboardKpis;
