import { useMutation, useQuery } from '@tanstack/react-query';

export function useMediaLibraryPageListQuery() {
  return useQuery({
    queryKey: ['media-library', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useMediaLibraryPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
