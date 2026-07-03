import { useMutation, useQuery } from '@tanstack/react-query';

export function usePaymentsPageListQuery() {
  return useQuery({
    queryKey: ['payments', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function usePaymentsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
