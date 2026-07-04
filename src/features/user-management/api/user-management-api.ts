import { customersFixture } from '@/features/user-management/api/fixtures/customers.fixture';
import {
  customerProfilesFixture,
  getProfileForCustomer,
} from '@/features/user-management/api/fixtures/customer-profile.fixture';
import { getTabDataForCustomer } from '@/features/user-management/api/fixtures/customer-tab-data.fixture';
import type {
  CustomerListItem,
  CustomerListParams,
  CustomerListResponse,
  CustomerStatus,
  UpdateCustomerInput,
} from '@/features/user-management/types/customer';
import type { CustomerProfile } from '@/features/user-management/types/customer-profile';
import type {
  CustomerAuditLog,
  CustomerBooking,
  CustomerLoyaltyEntry,
  CustomerNotification,
  CustomerPayment,
  CustomerReview,
  CustomerTabListParams,
} from '@/features/user-management/types/customer-tabs';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

/**
 * User Management API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET    /users?page&pageSize&search&status&sortBy&sortOrder
 * - GET    /users/:id
 * - PATCH  /users/:id
 * - PATCH  /users/:id/status
 * - POST   /users/:id/force-logout
 * - POST   /users/:id/reset-password
 * - DELETE /users/:id
 * - GET    /users/:id/bookings|payments|reviews|notifications|loyalty|audit-logs
 */

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

let customersStore: CustomerListItem[] = [...customersFixture];

function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

function filterCustomers(items: CustomerListItem[], params: CustomerListParams): CustomerListItem[] {
  let filtered = items;
  const search = params.search?.trim();

  if (search) {
    filtered = filtered.filter(
      (customer) =>
        matchesSearch(customer.name, search) ||
        matchesSearch(customer.email, search) ||
        matchesSearch(customer.phone, search),
    );
  }

  if (params.status) {
    filtered = filtered.filter((customer) => customer.status === params.status);
  }

  if (params.sortBy) {
    const order = params.sortOrder === 'desc' ? -1 : 1;
    const sortKey = params.sortBy;
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * order;
      }
      return String(aVal).localeCompare(String(bVal)) * order;
    });
  }

  return filtered;
}

function filterTabItems<T extends { id: string }>(
  items: T[],
  params: CustomerTabListParams,
  searchFields: Array<(item: T) => string>,
): T[] {
  const search = params.search?.trim();
  if (!search) return items;
  return items.filter((item) =>
    searchFields.some((field) => matchesSearch(field(item), search)),
  );
}

function findCustomer(id: string): CustomerListItem {
  const customer = customersStore.find((c) => c.id === id);
  if (!customer) {
    throw new Error(`Customer not found: ${id}`);
  }
  return customer;
}

function syncProfileStore(customer: CustomerListItem): void {
  if (customerProfilesFixture[customer.id]) {
    Object.assign(customerProfilesFixture[customer.id], customer);
  }
}

export function getCustomers(params: CustomerListParams = {}): Promise<CustomerListResponse> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterCustomers(customersStore, params);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerById(id: string): Promise<CustomerProfile> {
  const customer = findCustomer(id);
  return Promise.resolve(getProfileForCustomer(id, customer));
}

export function getCustomerBookings(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerBooking>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).bookings;
  const filtered = filterTabItems(items, params, [
    (b) => b.shopName,
    (b) => b.serviceName,
    (b) => b.status,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerPayments(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerPayment>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).payments;
  const filtered = filterTabItems(items, params, [
    (p) => p.method,
    (p) => p.status,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerReviews(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerReview>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).reviews;
  const filtered = filterTabItems(items, params, [
    (r) => r.shopName,
    (r) => r.comment,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerNotifications(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerNotification>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).notifications;
  const filtered = filterTabItems(items, params, [
    (n) => n.title,
    (n) => n.channel,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerLoyalty(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerLoyaltyEntry>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).loyalty;
  const filtered = filterTabItems(items, params, [(l) => l.description]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getCustomerAuditLogs(
  id: string,
  params: CustomerTabListParams = {},
): Promise<PaginatedResponse<CustomerAuditLog>> {
  findCustomer(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const items = getTabDataForCustomer(id).auditLogs;
  const filtered = filterTabItems(items, params, [
    (a) => a.action,
    (a) => a.actor,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function updateCustomer(id: string, data: UpdateCustomerInput): Promise<CustomerProfile> {
  const customer = findCustomer(id);
  Object.assign(customer, data);
  syncProfileStore(customer);
  return getCustomerById(id);
}

function setCustomerStatus(id: string, status: CustomerStatus): Promise<ApiMutationResponse> {
  const customer = findCustomer(id);
  customer.status = status;
  syncProfileStore(customer);
  return Promise.resolve({ success: true });
}

export function suspendCustomer(id: string): Promise<ApiMutationResponse> {
  return setCustomerStatus(id, 'suspended');
}

export function activateCustomer(id: string): Promise<ApiMutationResponse> {
  return setCustomerStatus(id, 'active');
}

export function forceLogoutCustomer(id: string): Promise<ApiMutationResponse> {
  findCustomer(id);
  return Promise.resolve({ success: true });
}

export function resetPasswordCustomer(id: string): Promise<ApiMutationResponse> {
  findCustomer(id);
  return Promise.resolve({ success: true });
}

export function deleteCustomer(id: string): Promise<ApiMutationResponse> {
  const index = customersStore.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Customer not found: ${id}`);
  }
  customersStore = customersStore.filter((c) => c.id !== id);
  delete customerProfilesFixture[id];
  return Promise.resolve({ success: true });
}
