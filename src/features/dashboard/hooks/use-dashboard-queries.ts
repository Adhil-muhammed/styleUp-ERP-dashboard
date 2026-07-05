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
import { useScope } from '@/shared/hooks/use-scope';

export function useDashboardKpisQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'kpis', merchantId ?? 'all'],
    queryFn: () => getDashboardKpis(merchantId),
  });
}

export function useDailyBookingsChartQuery(period: DailyBookingsPeriod) {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'daily-bookings', period, merchantId ?? 'all'],
    queryFn: () => getDailyBookingsChart(period),
  });
}

export function useMonthlyRevenueChartQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'monthly-revenue', merchantId ?? 'all'],
    queryFn: getMonthlyRevenueChart,
  });
}

export function useTopServicesChartQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'top-services', merchantId ?? 'all'],
    queryFn: getTopServicesChart,
  });
}

export function useTopShopsChartQuery() {
  const { merchantId, isAdmin } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'top-shops', merchantId ?? 'all'],
    queryFn: getTopShopsChart,
    enabled: isAdmin && merchantId === null,
  });
}

export function useCustomerGrowthChartQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'customer-growth', merchantId ?? 'all'],
    queryFn: getCustomerGrowthChart,
  });
}

export function useBookingStatusChartQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'charts', 'booking-status', merchantId ?? 'all'],
    queryFn: getBookingStatusChart,
  });
}

export function useDashboardActivityQuery<T extends ActivityTab>(
  tab: T,
  params: DashboardActivityParams,
) {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['dashboard', 'activity', tab, params, merchantId ?? 'all'],
    queryFn: () => getDashboardActivity(tab, params),
    placeholderData: keepPreviousData,
  });
}
