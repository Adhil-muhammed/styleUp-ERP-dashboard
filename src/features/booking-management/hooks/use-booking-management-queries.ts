import { useQuery } from '@tanstack/react-query';

import { getBookings } from '@/features/booking-management/api/booking-management-api';
import { useScope } from '@/shared/hooks/use-scope';

export function useBookingsQuery() {
  const { merchantId } = useScope();

  return useQuery({
    queryKey: ['booking-management', 'list', merchantId ?? 'all'],
    queryFn: () => getBookings(merchantId),
  });
}
