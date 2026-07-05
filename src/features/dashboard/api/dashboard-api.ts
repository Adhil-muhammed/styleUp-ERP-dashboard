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
 * - GET /dashboard/activity/:tab?page&pageSize&search&status|type|severity
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
import {
  dashboardKpisFixture,
  getShopDashboardKpis,
} from '@/features/dashboard/api/fixtures/dashboard-kpis.fixture';
import { mockDelay } from '@/shared/lib/mock-delay';
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
const DEFAULT_PAGE_SIZE = 5;

function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function filterActivityItems<T extends ActivityTab>(
  tab: T,
  items: ActivityItemMap[T][],
  params: DashboardActivityParams,
): ActivityItemMap[T][] {
  const search = params.search?.trim();
  let filtered = items;

  if (search) {
    filtered = filtered.filter((item) => {
      switch (tab) {
        case 'bookings': {
          const booking = item as ActivityItemMap['bookings'];
          return (
            matchesSearch(booking.customerName, search) ||
            matchesSearch(booking.shopName, search) ||
            matchesSearch(booking.serviceName, search)
          );
        }
        case 'registrations': {
          const registration = item as ActivityItemMap['registrations'];
          return (
            matchesSearch(registration.name, search) ||
            matchesSearch(registration.email, search)
          );
        }
        case 'reviews': {
          const review = item as ActivityItemMap['reviews'];
          return (
            matchesSearch(review.customerName, search) ||
            matchesSearch(review.shopName, search) ||
            matchesSearch(review.comment, search)
          );
        }
        case 'refunds': {
          const refund = item as ActivityItemMap['refunds'];
          return (
            matchesSearch(refund.customerName, search) ||
            matchesSearch(refund.bookingId, search)
          );
        }
        case 'alerts': {
          const alert = item as ActivityItemMap['alerts'];
          return matchesSearch(alert.message, search);
        }
        default:
          return true;
      }
    });
  }

  if (params.status && (tab === 'bookings' || tab === 'refunds')) {
    filtered = filtered.filter((item) => {
      if (tab === 'bookings') {
        return (item as ActivityItemMap['bookings']).status === params.status;
      }
      return (item as ActivityItemMap['refunds']).status === params.status;
    });
  }

  if (params.type && tab === 'registrations') {
    filtered = filtered.filter(
      (item) => (item as ActivityItemMap['registrations']).type === params.type,
    );
  }

  if (params.severity && tab === 'alerts') {
    filtered = filtered.filter(
      (item) => (item as ActivityItemMap['alerts']).severity === params.severity,
    );
  }

  return filtered;
}

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

export function getDashboardKpis(merchantId?: string | null): Promise<DashboardKpis> {
  const data = merchantId ? getShopDashboardKpis(merchantId) : dashboardKpisFixture;
  return mockDelay(data, 350);
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
  const filtered = filterActivityItems(tab, items, params);

  return Promise.resolve(paginate(filtered, page, pageSize) as DashboardActivityResponse<T>);
}
