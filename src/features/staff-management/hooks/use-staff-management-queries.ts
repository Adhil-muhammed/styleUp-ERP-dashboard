import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  assignStaffShop,
  createStaff,
  deleteStaff,
  getStaffBookings,
  getStaffById,
  getStaffLeave,
  getStaffList,
  getStaffPerformance,
  getStaffSkills,
  getStaffWorkingHours,
  updateStaff,
  updateStaffSkills,
  updateStaffStatus,
  updateStaffWorkingHours,
} from '@/features/staff-management/api/staff-management-api';
import type {
  AssignStaffShopInput,
  CreateStaffInput,
  StaffListParams,
  StaffStatus,
  UpdateStaffInput,
} from '@/features/staff-management/types';
import type { StaffTabListParams } from '@/features/staff-management/types/staff-tabs';
import type { WorkingHours } from '@/features/staff-management/types/staff-working-hours';
import { ROUTES } from '@/shared/config/routes';
import { useScope } from '@/shared/hooks/use-scope';

export function useStaffListQuery(params: Omit<StaffListParams, 'merchantId'> & { merchantId?: string | null }) {
  const { merchantId: scopeMerchantId } = useScope();
  const effectiveMerchantId = params.merchantId ?? scopeMerchantId;

  return useQuery({
    queryKey: ['staff-management', 'list', { ...params, merchantId: effectiveMerchantId ?? 'all' }],
    queryFn: () => getStaffList({ ...params, merchantId: effectiveMerchantId }),
    placeholderData: keepPreviousData,
  });
}

export function useStaffProfileQuery(staffId: string) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId],
    queryFn: () => getStaffById(staffId),
    enabled: Boolean(staffId),
  });
}

export function useStaffSkillsQuery(staffId: string) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId, 'skills'],
    queryFn: () => getStaffSkills(staffId),
    enabled: Boolean(staffId),
  });
}

export function useStaffWorkingHoursQuery(staffId: string) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId, 'working-hours'],
    queryFn: () => getStaffWorkingHours(staffId),
    enabled: Boolean(staffId),
  });
}

export function useStaffLeaveQuery(staffId: string) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId, 'leave'],
    queryFn: () => getStaffLeave(staffId),
    enabled: Boolean(staffId),
  });
}

export function useStaffBookingsQuery(staffId: string, params: StaffTabListParams) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId, 'bookings', params],
    queryFn: () => getStaffBookings(staffId, params),
    enabled: Boolean(staffId),
    placeholderData: keepPreviousData,
  });
}

export function useStaffPerformanceQuery(staffId: string, period: 7 | 30) {
  return useQuery({
    queryKey: ['staff-management', 'detail', staffId, 'performance', period],
    queryFn: () => getStaffPerformance(staffId, period),
    enabled: Boolean(staffId),
  });
}

function useInvalidateStaff(staffId?: string) {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
    if (staffId) {
      void queryClient.invalidateQueries({ queryKey: ['staff-management', 'detail', staffId] });
    }
  };
}

export function useCreateStaffMutation() {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaff(input),
    onSuccess: invalidate,
  });
}

export function useUpdateStaffMutation(staffId: string) {
  const invalidate = useInvalidateStaff(staffId);
  return useMutation({
    mutationFn: (input: UpdateStaffInput) => updateStaff(staffId, input),
    onSuccess: invalidate,
  });
}

export function useAssignStaffShopMutation(staffId: string) {
  const invalidate = useInvalidateStaff(staffId);
  return useMutation({
    mutationFn: (input: AssignStaffShopInput) => assignStaffShop(staffId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateStaffStatusMutation(staffId: string) {
  const invalidate = useInvalidateStaff(staffId);
  return useMutation({
    mutationFn: (status: StaffStatus) => updateStaffStatus(staffId, status),
    onSuccess: invalidate,
  });
}

export function useDeleteStaffMutation(staffId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deleteStaff(staffId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
      void navigate(ROUTES.staff);
    },
  });
}

export function useUpdateStaffSkillsMutation(staffId: string) {
  const invalidate = useInvalidateStaff(staffId);
  return useMutation({
    mutationFn: (skillIds: string[]) => updateStaffSkills(staffId, skillIds),
    onSuccess: invalidate,
  });
}

export function useUpdateStaffWorkingHoursMutation(staffId: string) {
  const invalidate = useInvalidateStaff(staffId);
  return useMutation({
    mutationFn: (hours: WorkingHours) => updateStaffWorkingHours(staffId, hours),
    onSuccess: invalidate,
  });
}