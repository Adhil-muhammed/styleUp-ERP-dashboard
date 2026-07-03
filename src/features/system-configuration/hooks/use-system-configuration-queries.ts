import { useMutation, useQuery } from '@tanstack/react-query';

export function useSystemConfigurationPageListQuery() {
  return useQuery({
    queryKey: ['system-configuration', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useSystemConfigurationPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
