import { useMutation, useQuery } from '@tanstack/react-query';

export function useUserManagementPageListQuery() {
  return useQuery({
    queryKey: ['user-management', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useUserManagementPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
