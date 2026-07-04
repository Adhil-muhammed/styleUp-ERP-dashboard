import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getBookingStatusChart,
  getCustomerGrowthChart,
  getDailyBookingsChart,
  getDashboardActivity,
  getDashboardKpis,
  getMonthlyRevenueChart,
  getTopServicesChart,
  getTopShopsChart,
} from '@/features/dashboard/api/dashboard-api';
import type {
  ActivityTab,
  DashboardActivityParams,
} from '@/features/dashboard/types/dashboard-activity';
import type { DailyBookingsPeriod } from '@/features/dashboard/types/dashboard-charts';

export function useDashboardKpisQuery() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: getDashboardKpis,
  });
}

export function useDailyBookingsChartQuery(period: DailyBookingsPeriod) {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'daily-bookings', period],
    queryFn: () => getDailyBookingsChart(period),
  });
}

export function useMonthlyRevenueChartQuery() {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'monthly-revenue'],
    queryFn: getMonthlyRevenueChart,
  });
}

export function useTopServicesChartQuery() {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'top-services'],
    queryFn: getTopServicesChart,
  });
}

export function useTopShopsChartQuery() {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'top-shops'],
    queryFn: getTopShopsChart,
  });
}

export function useCustomerGrowthChartQuery() {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'customer-growth'],
    queryFn: getCustomerGrowthChart,
  });
}

export function useBookingStatusChartQuery() {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'booking-status'],
    queryFn: getBookingStatusChart,
  });
}

export function useDashboardActivityQuery<T extends ActivityTab>(
  tab: T,
  params: DashboardActivityParams,
) {
  return useQuery({
    queryKey: ['dashboard', 'activity', tab, params],
    queryFn: () => getDashboardActivity(tab, params),
    placeholderData: keepPreviousData,
  });
}
