import type { ApiListParams } from '@/shared/types/api';
import type { WorkingHours } from '@/features/staff-management/types/staff-working-hours';

export type StaffProfileTab =
  | 'skills'
  | 'working-hours'
  | 'leave'
  | 'bookings'
  | 'performance';

export const STAFF_PROFILE_TABS: StaffProfileTab[] = [
  'skills',
  'working-hours',
  'leave',
  'bookings',
  'performance',
];

export type StaffSkill = {
  id: string;
  name: string;
  category: string;
};

export type StaffLeaveStatus = 'approved' | 'pending' | 'rejected';

export type StaffLeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: StaffLeaveStatus;
};

export type StaffBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type StaffBooking = {
  id: string;
  customerName: string;
  serviceName: string;
  status: StaffBookingStatus;
  scheduledAt: string;
  amount: number;
};

export type StaffPerformanceKpis = {
  totalBookings: number;
  completionRate: number;
  averageRating: number;
  cancellations: number;
};

export type StaffPerformanceTrendPoint = {
  date: string;
  bookings: number;
  rating: number;
};

export type StaffPerformanceMetrics = {
  period: 7 | 30;
  kpis: StaffPerformanceKpis;
  data: StaffPerformanceTrendPoint[];
};

export type StaffTabListParams = ApiListParams & {
  status?: StaffBookingStatus;
  dateFrom?: string;
  dateTo?: string;
};

export type StaffTabData = {
  skills: StaffSkill[];
  workingHours: WorkingHours;
  leave: StaffLeaveRequest[];
  bookings: StaffBooking[];
};
