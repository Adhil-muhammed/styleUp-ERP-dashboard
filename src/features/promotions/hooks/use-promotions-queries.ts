import { useMutation, useQuery } from '@tanstack/react-query';

export function usePromotionsPageListQuery() {
  return useQuery({
    queryKey: ['promotions', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function usePromotionsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
