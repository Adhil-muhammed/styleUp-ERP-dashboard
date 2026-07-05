import type { WorkingHours } from '@/features/staff-management/types/staff-working-hours';
import type {
  StaffBooking,
  StaffLeaveRequest,
  StaffPerformanceKpis,
  StaffPerformanceMetrics,
  StaffPerformanceTrendPoint,
  StaffSkill,
  StaffTabData,
} from '@/features/staff-management/types/staff-tabs';
import { STAFF_SKILL_CATALOG, staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';

const defaultWorkingHours: WorkingHours = {
  mon: { isClosed: false, openTime: '09:00', closeTime: '18:00' },
  tue: { isClosed: false, openTime: '09:00', closeTime: '18:00' },
  wed: { isClosed: false, openTime: '09:00', closeTime: '18:00' },
  thu: { isClosed: false, openTime: '09:00', closeTime: '18:00' },
  fri: { isClosed: false, openTime: '09:00', closeTime: '20:00' },
  sat: { isClosed: false, openTime: '10:00', closeTime: '20:00' },
  sun: { isClosed: true, openTime: null, closeTime: null },
};

const sampleLeave: StaffLeaveRequest[] = [
  {
    id: 'lv-001',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    reason: 'Family function',
    status: 'approved',
  },
  {
    id: 'lv-002',
    startDate: '2026-07-20',
    endDate: '2026-07-21',
    reason: 'Medical leave',
    status: 'pending',
  },
  {
    id: 'lv-003',
    startDate: '2026-06-05',
    endDate: '2026-06-06',
    reason: 'Personal',
    status: 'rejected',
  },
];

const sampleBookings: StaffBooking[] = [
  {
    id: 'sb-001',
    customerName: 'Ananya Nair',
    serviceName: 'Haircut & Styling',
    status: 'confirmed',
    scheduledAt: '2026-07-10T14:30:00Z',
    amount: 850,
  },
  {
    id: 'sb-002',
    customerName: 'Rahul Menon',
    serviceName: 'Beard Trim',
    status: 'completed',
    scheduledAt: '2026-07-04T11:00:00Z',
    amount: 350,
  },
  {
    id: 'sb-003',
    customerName: 'Priya Thomas',
    serviceName: 'Facial Treatment',
    status: 'pending',
    scheduledAt: '2026-07-12T16:00:00Z',
    amount: 1200,
  },
  {
    id: 'sb-004',
    customerName: 'Meera Krishnan',
    serviceName: 'Hair Colour',
    status: 'cancelled',
    scheduledAt: '2026-06-28T10:00:00Z',
    amount: 2500,
  },
  {
    id: 'sb-005',
    customerName: 'Vivek Das',
    serviceName: 'Manicure',
    status: 'completed',
    scheduledAt: '2026-07-03T09:30:00Z',
    amount: 600,
  },
  {
    id: 'sb-006',
    customerName: 'Arjun Pillai',
    serviceName: 'Haircut & Styling',
    status: 'confirmed',
    scheduledAt: '2026-07-15T10:00:00Z',
    amount: 850,
  },
];

function skillsForIds(ids: string[]): StaffSkill[] {
  return STAFF_SKILL_CATALOG.filter((skill) => ids.includes(skill.id));
}

function generateTrend(days: number, seed: number): StaffPerformanceTrendPoint[] {
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      bookings: Math.max(1, Math.floor(3 + ((index + seed) % 5))),
      rating: Number((4 + ((index + seed) % 8) / 10).toFixed(1)),
    };
  });
}

const defaultKpis: StaffPerformanceKpis = {
  totalBookings: 124,
  completionRate: 92,
  averageRating: 4.6,
  cancellations: 8,
};

const staffTabDataStore: Record<string, StaffTabData> = Object.fromEntries(
  staffFixture.map((member, index) => [
    member.id,
    {
      skills: skillsForIds([
        'skl-001',
        ...(index % 2 === 0 ? ['skl-002'] : []),
        ...(member.role === 'barber' ? ['skl-003'] : []),
        ...(member.role === 'beautician' ? ['skl-004', 'skl-006'] : []),
      ]),
      workingHours: { ...defaultWorkingHours },
      leave: sampleLeave.map((item, leaveIndex) => ({
        ...item,
        id: `${item.id}-${member.id}`,
        status: leaveIndex === index % 3 ? item.status : 'approved',
      })),
      bookings: sampleBookings.map((booking, bookingIndex) => ({
        ...booking,
        id: `${booking.id}-${member.id}`,
        scheduledAt: new Date(
          Date.parse(booking.scheduledAt) - bookingIndex * 86400000,
        ).toISOString(),
      })),
    } satisfies StaffTabData,
  ]),
);

const performanceStore: Record<string, Record<7 | 30, StaffPerformanceMetrics>> = {};

export function getTabDataForStaff(staffId: string): StaffTabData {
  if (!staffTabDataStore[staffId]) {
    staffTabDataStore[staffId] = {
      skills: skillsForIds(['skl-001']),
      workingHours: { ...defaultWorkingHours },
      leave: [],
      bookings: [],
    };
  }
  return staffTabDataStore[staffId];
}

export function getStaffTabDataStore(): Record<string, StaffTabData> {
  return staffTabDataStore;
}

export function getPerformanceForStaff(staffId: string, period: 7 | 30): StaffPerformanceMetrics {
  if (!performanceStore[staffId]) {
    const seed = staffId.charCodeAt(staffId.length - 1);
    performanceStore[staffId] = {
      7: { period: 7, kpis: defaultKpis, data: generateTrend(7, seed) },
      30: { period: 30, kpis: defaultKpis, data: generateTrend(30, seed) },
    };
  }
  return performanceStore[staffId][period];
}

export function getAllSkillsCatalog(): StaffSkill[] {
  return [...STAFF_SKILL_CATALOG];
}
