import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  activateCustomer,
  deleteCustomer,
  forceLogoutCustomer,
  getCustomerAuditLogs,
  getCustomerBookings,
  getCustomerById,
  getCustomerLoyalty,
  getCustomerNotifications,
  getCustomerPayments,
  getCustomerReviews,
  getCustomers,
  resetPasswordCustomer,
  suspendCustomer,
  updateCustomer,
} from '@/features/user-management/api/user-management-api';
import type { CustomerListParams, UpdateCustomerInput } from '@/features/user-management/types/customer';
import type { CustomerTabListParams } from '@/features/user-management/types/customer-tabs';
import { ROUTES } from '@/shared/config/routes';

export function useCustomerListQuery(params: CustomerListParams) {
  return useQuery({
    queryKey: ['user-management', 'list', params],
    queryFn: () => getCustomers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerProfileQuery(customerId: string) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: Boolean(customerId),
  });
}

export function useCustomerBookingsQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'bookings', params],
    queryFn: () => getCustomerBookings(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerPaymentsQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'payments', params],
    queryFn: () => getCustomerPayments(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerReviewsQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'reviews', params],
    queryFn: () => getCustomerReviews(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerNotificationsQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'notifications', params],
    queryFn: () => getCustomerNotifications(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerLoyaltyQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'loyalty', params],
    queryFn: () => getCustomerLoyalty(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

export function useCustomerAuditLogsQuery(customerId: string, params: CustomerTabListParams) {
  return useQuery({
    queryKey: ['user-management', 'detail', customerId, 'audit-logs', params],
    queryFn: () => getCustomerAuditLogs(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateCustomer(customerId: string) {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['user-management', 'list'] });
    void queryClient.invalidateQueries({ queryKey: ['user-management', 'detail', customerId] });
  };
}

export function useUpdateCustomerMutation(customerId: string) {
  const invalidate = useInvalidateCustomer(customerId);
  return useMutation({
    mutationFn: (data: UpdateCustomerInput) => updateCustomer(customerId, data),
    onSuccess: invalidate,
  });
}

export function useSuspendCustomerMutation(customerId: string) {
  const invalidate = useInvalidateCustomer(customerId);
  return useMutation({
    mutationFn: () => suspendCustomer(customerId),
    onSuccess: invalidate,
  });
}

export function useActivateCustomerMutation(customerId: string) {
  const invalidate = useInvalidateCustomer(customerId);
  return useMutation({
    mutationFn: () => activateCustomer(customerId),
    onSuccess: invalidate,
  });
}

export function useForceLogoutCustomerMutation(customerId: string) {
  const invalidate = useInvalidateCustomer(customerId);
  return useMutation({
    mutationFn: () => forceLogoutCustomer(customerId),
    onSuccess: invalidate,
  });
}

export function useResetPasswordCustomerMutation(customerId: string) {
  const invalidate = useInvalidateCustomer(customerId);
  return useMutation({
    mutationFn: () => resetPasswordCustomer(customerId),
    onSuccess: invalidate,
  });
}

export function useDeleteCustomerMutation(customerId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deleteCustomer(customerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user-management', 'list'] });
      void navigate(ROUTES.users);
    },
  });
}
