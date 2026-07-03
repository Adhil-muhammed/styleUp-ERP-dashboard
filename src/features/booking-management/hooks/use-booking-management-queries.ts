import { useMutation, useQuery } from '@tanstack/react-query';

export function useBookingManagementPageListQuery() {
  return useQuery({
    queryKey: ['booking-management', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useBookingManagementPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
