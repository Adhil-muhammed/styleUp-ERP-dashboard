import { useMutation, useQuery } from '@tanstack/react-query';

export function useDashboardPageListQuery() {
  return useQuery({
    queryKey: ['dashboard', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useDashboardPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
