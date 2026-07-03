import { useMutation, useQuery } from '@tanstack/react-query';

export function useServiceCatalogPageListQuery() {
  return useQuery({
    queryKey: ['service-catalog', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useServiceCatalogPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
