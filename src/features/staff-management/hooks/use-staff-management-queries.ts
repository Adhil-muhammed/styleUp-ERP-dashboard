import { useMutation, useQuery } from '@tanstack/react-query';

export function useStaffManagementPageListQuery() {
  return useQuery({
    queryKey: ['staff-management', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useStaffManagementPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
