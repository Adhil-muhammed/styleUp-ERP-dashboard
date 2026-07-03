import { useMutation, useQuery } from '@tanstack/react-query';

export function useMerchantManagementPageListQuery() {
  return useQuery({
    queryKey: ['merchant-management', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useMerchantManagementPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
