/**
 * Booking Management API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET /bookings?merchantId&page&pageSize
 */
import { bookingsFixture } from '@/features/booking-management/api/fixtures/bookings.fixture';
import type { BookingListItem } from '@/features/booking-management/types/booking';
import { mockDelay } from '@/shared/lib/mock-delay';

function filterByMerchant(
  items: BookingListItem[],
  merchantId?: string | null,
): BookingListItem[] {
  if (!merchantId) {
    return items;
  }
  return items.filter((item) => item.merchantId === merchantId);
}

export function getBookings(merchantId?: string | null): Promise<BookingListItem[]> {
  const filtered = filterByMerchant(bookingsFixture, merchantId);
  return mockDelay(filtered, 350);
}
