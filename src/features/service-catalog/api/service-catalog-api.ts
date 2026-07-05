/**
 * Service Catalog API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET    /service-catalog/categories?page&pageSize&search&status&sortBy&sortOrder
 * - GET    /service-catalog/categories/:id
 * - POST   /service-catalog/categories
 * - PATCH  /service-catalog/categories/:id
 * - DELETE /service-catalog/categories/:id
 * - GET    /service-catalog/variants?page&pageSize&search&categoryId&gender&status&sortBy&sortOrder
 * - GET    /service-catalog/variants/:id
 * - POST   /service-catalog/variants
 * - PATCH  /service-catalog/variants/:id
 * - DELETE /service-catalog/variants/:id
 * - POST   /service-catalog/variants/upload-image
 */
import {
  categoriesFixture,
} from '@/features/service-catalog/api/fixtures/categories.fixture';
import { serviceVariantsFixture } from '@/features/service-catalog/api/fixtures/service-variants.fixture';
import type {
  CreateCategoryInput,
  ServiceCategoryListItem,
  ServiceCategoryListParams,
  ServiceCategoryRecord,
  UpdateCategoryInput,
} from '@/features/service-catalog/types/category';
import type {
  CreateServiceVariantInput,
  ServiceVariantListItem,
  ServiceVariantListParams,
  ServiceVariantRecord,
  UpdateServiceVariantInput,
} from '@/features/service-catalog/types/service-variant';
import { mockDelay } from '@/shared/lib/mock-delay';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export const CATEGORY_HAS_VARIANTS_ERROR = 'CATEGORY_HAS_VARIANTS';

let categoriesStore: ServiceCategoryRecord[] = [...categoriesFixture];
let variantsStore: ServiceVariantRecord[] = [...serviceVariantsFixture];

function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

function countVariantsForCategory(categoryId: string): number {
  return variantsStore.filter((variant) => variant.categoryId === categoryId).length;
}

function getCategoryName(categoryId: string): string {
  return categoriesStore.find((category) => category.id === categoryId)?.name ?? 'Unknown';
}

function toCategoryListItem(category: ServiceCategoryRecord): ServiceCategoryListItem {
  return {
    ...category,
    variantCount: countVariantsForCategory(category.id),
  };
}

function toVariantListItem(variant: ServiceVariantRecord): ServiceVariantListItem {
  return {
    ...variant,
    categoryName: getCategoryName(variant.categoryId),
  };
}

function findCategory(id: string): ServiceCategoryRecord {
  const category = categoriesStore.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Category not found: ${id}`);
  }
  return category;
}

function findVariant(id: string): ServiceVariantRecord {
  const variant = variantsStore.find((item) => item.id === id);
  if (!variant) {
    throw new Error(`Service variant not found: ${id}`);
  }
  return variant;
}

function normalizeImageUrl(imageUrl?: string): string | undefined {
  const trimmed = imageUrl?.trim();
  return trimmed ? trimmed : undefined;
}

function filterCategories(
  items: ServiceCategoryRecord[],
  params: ServiceCategoryListParams,
): ServiceCategoryListItem[] {
  let filtered = items.map(toCategoryListItem);
  const search = params.search?.trim();

  if (search) {
    filtered = filtered.filter((item) => matchesSearch(item.name, search));
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  const sortBy = params.sortBy ?? 'name';
  const order = params.sortOrder === 'desc' ? -1 : 1;
  filtered = [...filtered].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * order;
    }
    return String(aVal).localeCompare(String(bVal)) * order;
  });

  return filtered;
}

function filterVariants(
  items: ServiceVariantRecord[],
  params: ServiceVariantListParams,
): ServiceVariantListItem[] {
  let filtered = items.map(toVariantListItem);
  const search = params.search?.trim();

  if (search) {
    filtered = filtered.filter(
      (item) =>
        matchesSearch(item.name, search) ||
        matchesSearch(item.categoryName, search) ||
        (item.description ? matchesSearch(item.description, search) : false),
    );
  }

  if (params.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === params.categoryId);
  }

  if (params.gender) {
    filtered = filtered.filter((item) => item.gender === params.gender);
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  const sortBy = params.sortBy ?? 'sortOrder';
  const order = params.sortOrder === 'desc' ? -1 : 1;
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'sortOrder') {
      const sortDiff = (a.sortOrder - b.sortOrder) * order;
      if (sortDiff !== 0) return sortDiff;
      return a.name.localeCompare(b.name);
    }
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * order;
    }
    return String(aVal).localeCompare(String(bVal)) * order;
  });

  return filtered;
}

function nextCategoryId(): string {
  const max = categoriesStore.reduce((acc, item) => {
    const num = Number.parseInt(item.id.replace('cat-', ''), 10);
    return Number.isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `cat-${String(max + 1).padStart(3, '0')}`;
}

function nextVariantId(): string {
  const max = variantsStore.reduce((acc, item) => {
    const num = Number.parseInt(item.id.replace('var-', ''), 10);
    return Number.isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `var-${String(max + 1).padStart(3, '0')}`;
}

export async function getCategories(
  params: ServiceCategoryListParams = {},
): Promise<PaginatedResponse<ServiceCategoryListItem>> {
  await mockDelay(350);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterCategories(categoriesStore, params);
  return paginate(filtered, page, pageSize);
}

export async function getCategoryById(id: string): Promise<ServiceCategoryListItem> {
  await mockDelay(200);
  return toCategoryListItem(findCategory(id));
}

export async function createCategory(input: CreateCategoryInput): Promise<ServiceCategoryListItem> {
  await mockDelay(350);
  const category: ServiceCategoryRecord = {
    id: nextCategoryId(),
    name: input.name,
    imageUrl: normalizeImageUrl(input.imageUrl),
    status: input.status,
  };
  categoriesStore = [...categoriesStore, category];
  return toCategoryListItem(category);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<ServiceCategoryListItem> {
  await mockDelay(350);
  const category = findCategory(id);
  category.name = input.name;
  category.imageUrl = normalizeImageUrl(input.imageUrl);
  category.status = input.status;
  return toCategoryListItem(category);
}

export async function deleteCategory(id: string): Promise<ApiMutationResponse> {
  await mockDelay(350);
  if (countVariantsForCategory(id) > 0) {
    throw new Error(CATEGORY_HAS_VARIANTS_ERROR);
  }
  const index = categoriesStore.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Category not found: ${id}`);
  }
  categoriesStore = categoriesStore.filter((item) => item.id !== id);
  return { success: true };
}

export async function getServiceVariants(
  params: ServiceVariantListParams = {},
): Promise<PaginatedResponse<ServiceVariantListItem>> {
  await mockDelay(350);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterVariants(variantsStore, params);
  return paginate(filtered, page, pageSize);
}

export async function getServiceVariantById(id: string): Promise<ServiceVariantListItem> {
  await mockDelay(200);
  return toVariantListItem(findVariant(id));
}

export async function createServiceVariant(
  input: CreateServiceVariantInput,
): Promise<ServiceVariantListItem> {
  await mockDelay(350);
  findCategory(input.categoryId);
  const variant: ServiceVariantRecord = {
    id: nextVariantId(),
    name: input.name,
    categoryId: input.categoryId,
    gender: input.gender,
    durationMinutes: input.durationMinutes,
    price: input.price,
    description: input.description?.trim() || undefined,
    imageUrl: normalizeImageUrl(input.imageUrl),
    status: input.status,
    sortOrder: input.sortOrder,
  };
  variantsStore = [...variantsStore, variant];
  return toVariantListItem(variant);
}

export async function updateServiceVariant(
  id: string,
  input: UpdateServiceVariantInput,
): Promise<ServiceVariantListItem> {
  await mockDelay(350);
  const variant = findVariant(id);
  findCategory(input.categoryId);
  Object.assign(variant, {
    name: input.name,
    categoryId: input.categoryId,
    gender: input.gender,
    durationMinutes: input.durationMinutes,
    price: input.price,
    description: input.description?.trim() || undefined,
    imageUrl: normalizeImageUrl(input.imageUrl),
    status: input.status,
    sortOrder: input.sortOrder,
  });
  return toVariantListItem(variant);
}

export async function deleteServiceVariant(id: string): Promise<ApiMutationResponse> {
  await mockDelay(350);
  const index = variantsStore.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Service variant not found: ${id}`);
  }
  variantsStore = variantsStore.filter((item) => item.id !== id);
  return { success: true };
}

export async function uploadServiceVariantImage(file: File): Promise<string> {
  await mockDelay(400);
  return `https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop&name=${encodeURIComponent(file.name)}`;
}

/** @deprecated Use getCategories */
export function fetchServiceCatalogPageList(): Promise<void> {
  return Promise.resolve();
}
