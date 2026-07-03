import { useMutation, useQuery } from '@tanstack/react-query';

export function useNotificationsPageListQuery() {
  return useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useNotificationsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
