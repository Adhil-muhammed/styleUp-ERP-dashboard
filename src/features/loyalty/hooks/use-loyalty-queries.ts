import { useMutation, useQuery } from '@tanstack/react-query';

export function useLoyaltyPageListQuery() {
  return useQuery({
    queryKey: ['loyalty', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useLoyaltyPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
