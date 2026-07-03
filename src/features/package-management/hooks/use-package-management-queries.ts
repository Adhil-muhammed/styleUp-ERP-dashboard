import { useMutation, useQuery } from '@tanstack/react-query';

export function usePackageManagementPageListQuery() {
  return useQuery({
    queryKey: ['package-management', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function usePackageManagementPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
