/**
 * Staff Management API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET    /staff?page&pageSize&search&merchantId&role&status&availability&sortBy&sortOrder
 * - GET    /staff/:id
 * - POST   /staff
 * - PATCH  /staff/:id
 * - PATCH  /staff/:id/shop
 * - PATCH  /staff/:id/status
 * - DELETE /staff/:id
 * - GET    /staff/:id/skills
 * - PUT    /staff/:id/skills
 * - GET    /staff/:id/working-hours
 * - PUT    /staff/:id/working-hours
 * - GET    /staff/:id/leave
 * - GET    /staff/:id/bookings
 * - GET    /staff/:id/performance?period=7|30
 */
import {
  getAllSkillsCatalog,
  getPerformanceForStaff,
  getStaffTabDataStore,
  getTabDataForStaff,
} from '@/features/staff-management/api/fixtures/staff-tab-data.fixture';
import {
  getProfileForStaff,
  staffProfilesFixture,
} from '@/features/staff-management/api/fixtures/staff-profile.fixture';
import {
  getShopName,
  staffFixture,
} from '@/features/staff-management/api/fixtures/staff.fixture';
import type {
  AssignStaffShopInput,
  CreateStaffInput,
  StaffListItem,
  StaffListParams,
  StaffStatus,
  UpdateStaffInput,
} from '@/features/staff-management/types';
import type { StaffProfile } from '@/features/staff-management/types/staff-profile';
import type {
  StaffBooking,
  StaffLeaveRequest,
  StaffPerformanceMetrics,
  StaffSkill,
  StaffTabListParams,
} from '@/features/staff-management/types/staff-tabs';
import type { WorkingHours } from '@/features/staff-management/types/staff-working-hours';
import { mockDelay } from '@/shared/lib/mock-delay';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const staffStore: StaffListItem[] = [...staffFixture];

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

function filterStaff(items: StaffListItem[], params: StaffListParams): StaffListItem[] {
  let filtered = items;
  const search = params.search?.trim();

  if (params.merchantId) {
    filtered = filtered.filter((item) => item.merchantId === params.merchantId);
  }

  if (search) {
    filtered = filtered.filter(
      (item) =>
        matchesSearch(item.name, search) ||
        matchesSearch(item.email, search) ||
        matchesSearch(item.phone, search) ||
        matchesSearch(item.shopName, search),
    );
  }

  if (params.role) {
    filtered = filtered.filter((item) => item.role === params.role);
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  if (params.availability) {
    filtered = filtered.filter((item) => item.availability === params.availability);
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

function findStaff(id: string): StaffListItem {
  const member = staffStore.find((item) => item.id === id);
  if (!member) {
    throw new Error(`Staff not found: ${id}`);
  }
  return member;
}

function syncProfile(member: StaffListItem): void {
  const existing = staffProfilesFixture[member.id];
  staffProfilesFixture[member.id] = {
    ...(existing ?? {
      bio: `${member.name} is a dedicated team member.`,
      joinedAt: new Date().toISOString(),
      skillIds: [],
    }),
    ...member,
    skillIds: existing?.skillIds ?? [],
  };
}

function filterTabBookings(
  items: StaffBooking[],
  params: StaffTabListParams,
): StaffBooking[] {
  let filtered = items;
  const search = params.search?.trim();

  if (search) {
    filtered = filtered.filter(
      (item) =>
        matchesSearch(item.customerName, search) ||
        matchesSearch(item.serviceName, search),
    );
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  if (params.dateFrom) {
    filtered = filtered.filter((item) => item.scheduledAt >= params.dateFrom!);
  }

  if (params.dateTo) {
    filtered = filtered.filter((item) => item.scheduledAt <= params.dateTo!);
  }

  return filtered;
}

export function getStaffList(params: StaffListParams = {}): Promise<PaginatedResponse<StaffListItem>> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterStaff(staffStore, params);
  return mockDelay(paginate(filtered, page, pageSize), 350);
}

export function getStaffById(id: string): Promise<StaffProfile> {
  findStaff(id);
  return mockDelay(getProfileForStaff(id), 350);
}

export function createStaff(input: CreateStaffInput): Promise<ApiMutationResponse & { id: string }> {
  const id = `stf-${String(staffStore.length + 1).padStart(3, '0')}`;
  const member: StaffListItem = {
    id,
    merchantId: input.merchantId,
    shopName: getShopName(input.merchantId),
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    rating: 4.0,
    availability: input.availability,
    status: input.status,
  };
  staffStore.unshift(member);
  syncProfile(member);
  const tabStore = getStaffTabDataStore();
  tabStore[id] = getTabDataForStaff('stf-001');
  staffProfilesFixture[id] = {
    ...member,
    bio: `${member.name} recently joined the team.`,
    joinedAt: new Date().toISOString(),
    skillIds: input.skillIds,
  };
  return mockDelay({ success: true, id }, 350);
}

export function updateStaff(id: string, input: UpdateStaffInput): Promise<ApiMutationResponse> {
  const index = staffStore.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Staff not found: ${id}`);
  }
  const updated: StaffListItem = {
    ...staffStore[index],
    ...input,
  };
  staffStore[index] = updated;
  syncProfile(updated);
  return mockDelay({ success: true }, 350);
}

export function assignStaffShop(id: string, input: AssignStaffShopInput): Promise<ApiMutationResponse> {
  const member = findStaff(id);
  member.merchantId = input.merchantId;
  member.shopName = getShopName(input.merchantId);
  syncProfile(member);
  return mockDelay({ success: true }, 350);
}

export function updateStaffStatus(id: string, status: StaffStatus): Promise<ApiMutationResponse> {
  const member = findStaff(id);
  member.status = status;
  syncProfile(member);
  return mockDelay({ success: true }, 350);
}

export function deleteStaff(id: string): Promise<ApiMutationResponse> {
  const index = staffStore.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Staff not found: ${id}`);
  }
  staffStore.splice(index, 1);
  delete staffProfilesFixture[id];
  delete getStaffTabDataStore()[id];
  return mockDelay({ success: true }, 350);
}

export function getStaffSkills(id: string): Promise<StaffSkill[]> {
  findStaff(id);
  return mockDelay(getTabDataForStaff(id).skills, 350);
}

export function updateStaffSkills(id: string, skillIds: string[]): Promise<ApiMutationResponse> {
  findStaff(id);
  const catalog = getAllSkillsCatalog();
  const tabData = getTabDataForStaff(id);
  tabData.skills = catalog.filter((skill) => skillIds.includes(skill.id));
  staffProfilesFixture[id].skillIds = skillIds;
  return mockDelay({ success: true }, 350);
}

export function getStaffWorkingHours(id: string): Promise<WorkingHours> {
  findStaff(id);
  return mockDelay(getTabDataForStaff(id).workingHours, 350);
}

export function updateStaffWorkingHours(
  id: string,
  hours: WorkingHours,
): Promise<ApiMutationResponse> {
  findStaff(id);
  getTabDataForStaff(id).workingHours = hours;
  return mockDelay({ success: true }, 350);
}

export function getStaffLeave(id: string): Promise<StaffLeaveRequest[]> {
  findStaff(id);
  return mockDelay(getTabDataForStaff(id).leave, 350);
}

export function getStaffBookings(
  id: string,
  params: StaffTabListParams = {},
): Promise<PaginatedResponse<StaffBooking>> {
  findStaff(id);
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? 10;
  const filtered = filterTabBookings(getTabDataForStaff(id).bookings, params);
  return mockDelay(paginate(filtered, page, pageSize), 350);
}

export function getStaffPerformance(
  id: string,
  period: 7 | 30 = 7,
): Promise<StaffPerformanceMetrics> {
  findStaff(id);
  return mockDelay(getPerformanceForStaff(id, period), 350);
}

/** @deprecated Use getStaffList */
export function getStaff(merchantId?: string | null): Promise<StaffListItem[]> {
  return getStaffList({ merchantId, pageSize: 1000 }).then((response) => response.data);
}
