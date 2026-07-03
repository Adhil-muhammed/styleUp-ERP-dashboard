import { useMutation, useQuery } from '@tanstack/react-query';

export function useAuditLogsPageListQuery() {
  return useQuery({
    queryKey: ['audit-logs', 'list'],
    queryFn: (): Promise<void> => Promise.resolve(),
  });
}

export function useAuditLogsPageMutation() {
  return useMutation({
    mutationFn: (_input: unknown): Promise<void> => Promise.resolve(),
  });
}
