import { useMutation, useQuery } from '@tanstack/react-query';

export function useCalendarSchedulingPageListQuery() {
  return useQuery({
    queryKey: ['calendar-scheduling', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useCalendarSchedulingPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
