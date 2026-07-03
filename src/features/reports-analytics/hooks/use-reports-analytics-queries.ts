import { useMutation, useQuery } from '@tanstack/react-query';

export function useReportsAnalyticsPageListQuery() {
  return useQuery({
    queryKey: ['reports-analytics', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useReportsAnalyticsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
