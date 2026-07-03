import { useMutation, useQuery } from '@tanstack/react-query';

export function useMessagingPageListQuery() {
  return useQuery({
    queryKey: ['messaging', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useMessagingPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
