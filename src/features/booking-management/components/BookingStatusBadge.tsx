import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingStatus } from '@/features/booking-management/types/booking';
import { Badge } from '@/shared/components/ui/badge';

function statusVariant(status: BookingStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'confirmed':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
    case 'no_show':
      return 'destructive';
  }
}

export function BookingStatusBadge({ status }: { status: BookingStatus }): React.ReactElement {
  const { t } = useTranslation('booking-management');
  return (
    <Badge variant={statusVariant(status)}>{t(`status.${status}`)}</Badge>
  );
}
