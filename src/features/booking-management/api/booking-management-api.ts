/**
 * Booking Management API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET    /bookings?merchantId&page&pageSize&status&shopId&staffId&dateFrom&dateTo&customerSearch&paymentStatus&sortBy&sortOrder
 * - GET    /bookings/:id
 * - POST   /bookings/:id/confirm
 * - POST   /bookings/:id/reschedule
 * - POST   /bookings/:id/cancel
 * - POST   /bookings/:id/complete
 * - POST   /bookings/:id/no-show
 * - PATCH  /bookings/:id/notes
 */
import { bookingDetailsFixture } from '@/features/booking-management/api/fixtures/booking-details.fixture';
import { bookingsFixture } from '@/features/booking-management/api/fixtures/bookings.fixture';
import type {
  CancelBookingInput,
  CreateBookingInput,
  RescheduleBookingInput,
  UpdateBookingNotesInput,
} from '@/features/booking-management/types/booking.schema';
import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import type { BookingListItem, BookingListParams } from '@/features/booking-management/types/booking';
import { customersFixture } from '@/features/user-management/api/fixtures/customers.fixture';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { mockDelay } from '@/shared/lib/mock-delay';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

type BookingRecord = BookingListItem & {
  customerPhone: string;
  customerAvatarUrl?: string;
  service?: BookingDetail['service'];
  package?: BookingDetail['package'];
  timeline: BookingDetail['timeline'];
  payment: BookingDetail['payment'];
  internalNotes: string;
  customerNotes: string;
};

function buildInitialStore(): BookingRecord[] {
  return bookingsFixture.map((item) => {
    const detail = bookingDetailsFixture[item.id];
    const customer = customersFixture.find((c) => c.id === item.customerId);
    return {
      ...item,
      customerPhone: detail?.customerPhone ?? customer?.phone ?? '',
      service: detail?.service,
      package: detail?.package,
      timeline: detail?.timeline ?? [{ type: 'created', at: item.scheduledAt }],
      payment: detail?.payment ?? {
        amount: item.amount,
        method: 'Cash',
        status: item.paymentStatus,
      },
      internalNotes: detail?.internalNotes ?? '',
      customerNotes: detail?.customerNotes ?? '',
    };
  });
}

let bookingsStore: BookingRecord[] = buildInitialStore();

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

function findBooking(id: string): BookingRecord {
  const booking = bookingsStore.find((item) => item.id === id);
  if (!booking) {
    throw new Error(`Booking not found: ${id}`);
  }
  return booking;
}

function toListItem(record: BookingRecord): BookingListItem {
  const {
    customerPhone: _phone,
    customerAvatarUrl: _avatar,
    service: _service,
    package: _package,
    timeline: _timeline,
    payment: _payment,
    internalNotes: _internal,
    customerNotes: _customer,
    ...listItem
  } = record;
  return listItem;
}

function toDetail(record: BookingRecord): BookingDetail {
  return { ...record };
}

function matchesCustomerSearch(record: BookingRecord, query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    record.customerName.toLowerCase().includes(normalized) ||
    record.customerPhone.toLowerCase().includes(normalized)
  );
}

function filterBookings(items: BookingRecord[], params: BookingListParams): BookingRecord[] {
  let filtered = [...items];

  const scopeMerchantId = params.merchantId;
  if (scopeMerchantId) {
    filtered = filtered.filter((item) => item.merchantId === scopeMerchantId);
  }

  if (params.shopId) {
    filtered = filtered.filter((item) => item.merchantId === params.shopId);
  }

  if (params.staffId) {
    filtered = filtered.filter((item) => item.staffId === params.staffId);
  }

  if (params.upcoming) {
    const now = Date.now();
    filtered = filtered.filter(
      (item) => item.status === 'confirmed' && new Date(item.scheduledAt).getTime() > now,
    );
  } else if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  if (params.paymentStatus) {
    filtered = filtered.filter((item) => item.paymentStatus === params.paymentStatus);
  }

  if (params.dateFrom) {
    filtered = filtered.filter((item) => item.scheduledAt >= params.dateFrom!);
  }

  if (params.dateTo) {
    const endOfDay = `${params.dateTo}T23:59:59.999Z`;
    filtered = filtered.filter((item) => item.scheduledAt <= endOfDay);
  }

  const customerSearch = params.customerSearch?.trim();
  if (customerSearch) {
    filtered = filtered.filter((item) => matchesCustomerSearch(item, customerSearch));
  }

  const search = params.search?.trim();
  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        item.shopName.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const sortBy = params.sortBy ?? 'scheduledAt';
  const order = params.sortOrder === 'asc' ? 1 : -1;

  filtered.sort((a, b) => {
    if (sortBy === 'scheduledAt') {
      return (
        (new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) * order
      );
    }
    if (sortBy === 'amount') {
      return (a.amount - b.amount) * order;
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status) * order;
    }
    return a.customerName.localeCompare(b.customerName) * order;
  });

  return filtered;
}

export function getBookings(params: BookingListParams): Promise<PaginatedResponse<BookingListItem>> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterBookings(bookingsStore, params).map(toListItem);
  return mockDelay(paginate(filtered, page, pageSize), 350);
}

export function getBookingById(id: string): Promise<BookingDetail> {
  return mockDelay(toDetail(findBooking(id)), 250);
}

export function confirmBooking(id: string): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  if (booking.status !== 'pending') {
    throw new Error('Only pending bookings can be confirmed');
  }
  booking.status = 'confirmed';
  booking.timeline.push({ type: 'confirmed', at: new Date().toISOString() });
  return mockDelay({ success: true }, 300);
}

export function rescheduleBooking(
  id: string,
  input: RescheduleBookingInput,
): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  if (booking.status !== 'confirmed') {
    throw new Error('Only confirmed bookings can be rescheduled');
  }
  const scheduledAt = new Date(input.scheduledAt).toISOString();
  booking.scheduledAt = scheduledAt;
  booking.timeline.push({
    type: 'rescheduled',
    at: new Date().toISOString(),
    note: scheduledAt,
  });
  return mockDelay({ success: true }, 300);
}

export function cancelBooking(
  id: string,
  input: CancelBookingInput,
): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    throw new Error('Only pending or confirmed bookings can be cancelled');
  }
  booking.status = 'cancelled';
  booking.timeline.push({
    type: 'cancelled',
    at: new Date().toISOString(),
    note: input.reason,
  });
  return mockDelay({ success: true }, 300);
}

export function completeBooking(id: string): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  if (booking.status !== 'confirmed') {
    throw new Error('Only confirmed bookings can be completed');
  }
  if (new Date(booking.scheduledAt).getTime() > Date.now()) {
    throw new Error('Cannot complete a future booking');
  }
  booking.status = 'completed';
  booking.timeline.push({ type: 'completed', at: new Date().toISOString() });
  return mockDelay({ success: true }, 300);
}

export function markBookingNoShow(
  id: string,
  input: CancelBookingInput,
): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  if (booking.status !== 'confirmed') {
    throw new Error('Only confirmed bookings can be marked as no-show');
  }
  booking.status = 'no_show';
  booking.timeline.push({
    type: 'no_show',
    at: new Date().toISOString(),
    note: input.reason,
  });
  return mockDelay({ success: true }, 300);
}

export type BookingCalendarRecord = BookingListItem & {
  durationMinutes: number;
  customerPhone: string;
};

export type BookingsInRangeParams = {
  shopId: string;
  rangeStart: string;
  rangeEnd: string;
  staffIds?: string[];
};

function getDurationMinutes(record: BookingRecord): number {
  if (record.service?.durationMinutes) {
    return record.service.durationMinutes;
  }
  if (record.package?.includedServices.length) {
    return record.package.includedServices.reduce((sum, item) => sum + item.durationMinutes, 0);
  }
  return 60;
}

function toCalendarRecord(record: BookingRecord): BookingCalendarRecord {
  return {
    ...toListItem(record),
    durationMinutes: getDurationMinutes(record),
    customerPhone: record.customerPhone,
  };
}

export function getBookingsInRange(params: BookingsInRangeParams): Promise<BookingCalendarRecord[]> {
  const rangeEnd = params.rangeEnd.includes('T')
    ? params.rangeEnd
    : `${params.rangeEnd}T23:59:59.999Z`;
  let filtered = bookingsStore.filter(
    (item) =>
      item.merchantId === params.shopId &&
      item.scheduledAt >= params.rangeStart &&
      item.scheduledAt <= rangeEnd,
  );
  if (params.staffIds?.length) {
    filtered = filtered.filter((item) => params.staffIds!.includes(item.staffId));
  }
  return mockDelay(filtered.map(toCalendarRecord), 300);
}

let nextBookingCounter = 100;

export function createBooking(input: CreateBookingInput): Promise<{ id: string; success: boolean }> {
  const staff = staffFixture.find((item) => item.id === input.staffId);
  const shopNames: Record<string, string> = {
    'shp-001': 'Luxe Salon Kochi',
    'shp-002': 'Glow Studio Edappally',
    'shp-003': 'StyleQuest MG Road',
    'shp-004': 'Urban Cuts Kaloor',
  };
  const id = `bkg-${String(nextBookingCounter++).padStart(3, '0')}`;
  const scheduledAt = new Date(input.scheduledAt).toISOString();
  const record: BookingRecord = {
    id,
    merchantId: input.shopId,
    shopName: shopNames[input.shopId] ?? 'Unknown Shop',
    customerId: `usr-new-${id}`,
    customerName: input.customerName,
    staffId: input.staffId,
    staffName: staff?.name ?? 'Unassigned',
    kind: 'service',
    serviceName: input.serviceName,
    status: 'pending',
    scheduledAt,
    paymentStatus: 'pending',
    amount: input.amount,
    customerPhone: input.customerPhone,
    service: {
      name: input.serviceName,
      category: 'General',
      durationMinutes: input.durationMinutes,
      price: input.amount,
    },
    timeline: [{ type: 'created', at: new Date().toISOString() }],
    payment: { amount: input.amount, method: 'Cash', status: 'pending' },
    internalNotes: '',
    customerNotes: '',
  };
  bookingsStore = [record, ...bookingsStore];
  return mockDelay({ id, success: true }, 350);
}

export function updateBookingNotes(
  id: string,
  input: UpdateBookingNotesInput,
): Promise<ApiMutationResponse> {
  const booking = findBooking(id);
  booking.internalNotes = input.internalNotes;
  return mockDelay({ success: true }, 200);
}
