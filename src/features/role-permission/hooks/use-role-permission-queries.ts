import { useMutation, useQuery } from '@tanstack/react-query';

export function useRolePermissionPageListQuery() {
  return useQuery({
    queryKey: ['role-permission', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useRolePermissionPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
