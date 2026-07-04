/**
 * Dashboard API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET /dashboard/kpis
 * - GET /dashboard/charts/daily-bookings?days=7|30
 * - GET /dashboard/charts/monthly-revenue?months=12
 * - GET /dashboard/charts/top-services
 * - GET /dashboard/charts/top-shops
 * - GET /dashboard/charts/customer-growth
 * - GET /dashboard/charts/booking-status
 * - GET /dashboard/activity/:tab?page&pageSize
 */
import {
  bookingStatusFixture,
  customerGrowthFixture,
  dailyBookings30Fixture,
  dailyBookings7Fixture,
  monthlyRevenueFixture,
  topServicesFixture,
  topShopsFixture,
} from '@/features/dashboard/api/fixtures/dashboard-charts.fixture';
import { activityFixtures } from '@/features/dashboard/api/fixtures/dashboard-activity.fixture';
import { dashboardKpisFixture } from '@/features/dashboard/api/fixtures/dashboard-kpis.fixture';
import type {
  ActivityItemMap,
  ActivityTab,
  DashboardActivityParams,
  DashboardActivityResponse,
} from '@/features/dashboard/types/dashboard-activity';
import type {
  BookingStatusResponse,
  CustomerGrowthResponse,
  DailyBookingsPeriod,
  DailyBookingsResponse,
  MonthlyRevenueResponse,
  RankedItemsResponse,
} from '@/features/dashboard/types/dashboard-charts';
import type { DashboardKpis } from '@/features/dashboard/types/dashboard-kpis';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): { data: T[]; total: number; page: number; pageSize: number } {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    total: items.length,
    page,
    pageSize,
  };
}

export function getDashboardKpis(): Promise<DashboardKpis> {
  return Promise.resolve(dashboardKpisFixture);
}

export function getDailyBookingsChart(
  period: DailyBookingsPeriod,
): Promise<DailyBookingsResponse> {
  return Promise.resolve(period === 7 ? dailyBookings7Fixture : dailyBookings30Fixture);
}

export function getMonthlyRevenueChart(): Promise<MonthlyRevenueResponse> {
  return Promise.resolve(monthlyRevenueFixture);
}

export function getTopServicesChart(): Promise<RankedItemsResponse> {
  return Promise.resolve(topServicesFixture);
}

export function getTopShopsChart(): Promise<RankedItemsResponse> {
  return Promise.resolve(topShopsFixture);
}

export function getCustomerGrowthChart(): Promise<CustomerGrowthResponse> {
  return Promise.resolve(customerGrowthFixture);
}

export function getBookingStatusChart(): Promise<BookingStatusResponse> {
  return Promise.resolve(bookingStatusFixture);
}

export function getDashboardActivity<T extends ActivityTab>(
  tab: T,
  params: DashboardActivityParams = {},
): Promise<DashboardActivityResponse<T>> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = activityFixtures[tab] as ActivityItemMap[T][];

  return Promise.resolve(paginate(items, page, pageSize) as DashboardActivityResponse<T>);
}
