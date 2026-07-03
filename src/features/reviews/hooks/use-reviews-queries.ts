import { useMutation, useQuery } from '@tanstack/react-query';

export function useReviewsPageListQuery() {
  return useQuery({
    queryKey: ['reviews', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useReviewsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
