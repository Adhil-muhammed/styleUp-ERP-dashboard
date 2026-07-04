/**
 * Merchant Management API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET    /merchants?page&pageSize&search&status&city&sortBy&sortOrder
 * - GET    /merchants/:id
 * - PATCH  /merchants/:id
 * - PATCH  /merchants/:id/working-hours
 * - POST   /merchants/:id/gallery
 * - DELETE /merchants/:id/gallery/:imageId
 * - PATCH  /merchants/:id/approve|reject|suspend|feature
 * - GET    /merchants/:id/services|packages|staff|bookings|reviews|audit-logs|performance
 */
import { getGalleryForShop, shopGalleryFixture } from '@/features/merchant-management/api/fixtures/shop-gallery.fixture';
import { getPerformanceForShop } from '@/features/merchant-management/api/fixtures/shop-performance.fixture';
import {
  getProfileForShop,
  shopProfilesFixture,
} from '@/features/merchant-management/api/fixtures/shop-profile.fixture';
import { getTabDataForShop } from '@/features/merchant-management/api/fixtures/shop-tab-data.fixture';
import {
  getWorkingHoursForShop,
  shopWorkingHoursFixture,
} from '@/features/merchant-management/api/fixtures/shop-working-hours.fixture';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import type {
  RejectShopInput,
  ShopListItem,
  ShopListParams,
  ShopListResponse,
  SuspendShopInput,
  UpdateShopGeneralInput,
} from '@/features/merchant-management/types/shop';
import type { ShopProfile } from '@/features/merchant-management/types/shop-profile';
import type {
  ShopAuditLog,
  ShopBooking,
  ShopGalleryImage,
  ShopPackage,
  ShopPerformanceMetrics,
  ShopReview,
  ShopService,
  ShopStaffMember,
  ShopTabListParams,
} from '@/features/merchant-management/types/shop-tabs';
import type { WorkingHours } from '@/features/merchant-management/types/working-hours';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const shopsStore: ShopListItem[] = [...shopsFixture];

function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return { data: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

function filterShops(items: ShopListItem[], params: ShopListParams): ShopListItem[] {
  let filtered = items;
  const search = params.search?.trim();

  if (search) {
    filtered = filtered.filter(
      (shop) =>
        matchesSearch(shop.shopName, search) || matchesSearch(shop.ownerName, search),
    );
  }

  if (params.status) {
    filtered = filtered.filter((shop) => shop.status === params.status);
  }

  if (params.city) {
    filtered = filtered.filter((shop) => shop.city === params.city);
  }

  if (params.sortBy) {
    const order = params.sortOrder === 'desc' ? -1 : 1;
    const sortKey = params.sortBy;
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
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
  params: ShopTabListParams,
  searchFields: Array<(item: T) => string>,
): T[] {
  const search = params.search?.trim();
  if (!search) return items;
  return items.filter((item) =>
    searchFields.some((field) => matchesSearch(field(item), search)),
  );
}

function findShop(id: string): ShopListItem {
  const shop = shopsStore.find((s) => s.id === id);
  if (!shop) throw new Error(`Shop not found: ${id}`);
  return shop;
}

function syncProfileStore(shop: ShopListItem): void {
  if (shopProfilesFixture[shop.id]) {
    Object.assign(shopProfilesFixture[shop.id], shop);
  }
}

export function getShops(params: ShopListParams = {}): Promise<ShopListResponse> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  return Promise.resolve(paginate(filterShops(shopsStore, params), page, pageSize));
}

export function getShopById(id: string): Promise<ShopProfile> {
  const shop = findShop(id);
  return Promise.resolve(getProfileForShop(id, shop));
}

export function getShopWorkingHours(id: string): Promise<WorkingHours> {
  findShop(id);
  return Promise.resolve(getWorkingHoursForShop(id));
}

export function getShopGallery(id: string): Promise<ShopGalleryImage[]> {
  findShop(id);
  return Promise.resolve(getGalleryForShop(id));
}

export function getShopServices(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopService>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).services;
  const filtered = filterTabItems(items, params, [(s) => s.name, (s) => s.category]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopPackages(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopPackage>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).packages;
  const filtered = filterTabItems(items, params, [(p) => p.name]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopStaff(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopStaffMember>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).staff;
  const filtered = filterTabItems(items, params, [(s) => s.name, (s) => s.role]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopBookings(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopBooking>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).bookings;
  const filtered = filterTabItems(items, params, [
    (b) => b.customerName,
    (b) => b.serviceName,
    (b) => b.status,
  ]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopReviews(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopReview>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).reviews;
  const filtered = filterTabItems(items, params, [(r) => r.customerName, (r) => r.comment]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopAuditLogs(
  id: string,
  params: ShopTabListParams = {},
): Promise<PaginatedResponse<ShopAuditLog>> {
  findShop(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const items = getTabDataForShop(id).auditLogs;
  const filtered = filterTabItems(items, params, [(a) => a.action, (a) => a.actor]);
  return Promise.resolve(paginate(filtered, page, pageSize));
}

export function getShopPerformance(
  id: string,
  period: 7 | 30 = 7,
): Promise<ShopPerformanceMetrics> {
  findShop(id);
  return Promise.resolve(getPerformanceForShop(id, period));
}

export function updateShopGeneral(id: string, data: UpdateShopGeneralInput): Promise<ShopProfile> {
  const shop = findShop(id);
  Object.assign(shop, {
    shopName: data.shopName,
    ownerName: data.ownerName,
    city: data.city,
  });
  if (shopProfilesFixture[id]) {
    Object.assign(shopProfilesFixture[id], data);
  }
  syncProfileStore(shop);
  return getShopById(id);
}

export function updateShopWorkingHours(id: string, data: WorkingHours): Promise<WorkingHours> {
  findShop(id);
  shopWorkingHoursFixture[id] = structuredClone(data);
  return Promise.resolve(data);
}

export function uploadShopGalleryImages(
  id: string,
  files: File[],
): Promise<ShopGalleryImage[]> {
  findShop(id);
  const current = shopGalleryFixture[id] ?? [];
  const newImages: ShopGalleryImage[] = files.map((file, index) => ({
    id: `img-${Date.now()}-${index}`,
    url: URL.createObjectURL(file),
    alt: file.name,
    uploadedAt: new Date().toISOString(),
  }));
  shopGalleryFixture[id] = [...current, ...newImages];
  return Promise.resolve(shopGalleryFixture[id]);
}

export function deleteShopGalleryImage(id: string, imageId: string): Promise<ApiMutationResponse> {
  findShop(id);
  shopGalleryFixture[id] = (shopGalleryFixture[id] ?? []).filter((img) => img.id !== imageId);
  return Promise.resolve({ success: true });
}

export function approveShop(id: string): Promise<ApiMutationResponse> {
  const shop = findShop(id);
  shop.status = 'approved';
  syncProfileStore(shop);
  return Promise.resolve({ success: true });
}

export function rejectShop(id: string, input: RejectShopInput): Promise<ApiMutationResponse> {
  const shop = findShop(id);
  shop.status = 'rejected';
  if (shopProfilesFixture[id]) {
    shopProfilesFixture[id].rejectionReason = input.reason;
  }
  syncProfileStore(shop);
  return Promise.resolve({ success: true });
}

export function suspendShop(id: string, input: SuspendShopInput): Promise<ApiMutationResponse> {
  const shop = findShop(id);
  shop.status = 'suspended';
  if (shopProfilesFixture[id]) {
    shopProfilesFixture[id].suspensionReason = input.reason;
  }
  syncProfileStore(shop);
  return Promise.resolve({ success: true });
}

export function toggleFeatureShop(id: string, featured: boolean): Promise<ApiMutationResponse> {
  const shop = findShop(id);
  shop.isFeatured = featured;
  syncProfileStore(shop);
  return Promise.resolve({ success: true });
}
