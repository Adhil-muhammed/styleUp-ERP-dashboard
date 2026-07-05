import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { PaymentStatus } from '@/features/booking-management/types/booking';
import { Badge } from '@/shared/components/ui/badge';

function paymentVariant(
  status: PaymentStatus,
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'paid':
      return 'default';
    case 'pending':
    case 'partially_paid':
      return 'outline';
    case 'failed':
    case 'refunded':
      return 'destructive';
  }
}

export function BookingPaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}): React.ReactElement {
  const { t } = useTranslation('booking-management');
  return (
    <Badge variant={paymentVariant(status)}>{t(`paymentStatus.${status}`)}</Badge>
  );
}
