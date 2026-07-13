import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { TransactionStatus } from '@/features/payments/types/payment';
import { Badge } from '@/shared/components/ui/badge';

function paymentVariant(
  status: TransactionStatus,
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'success':
      return 'default';
    case 'pending':
      return 'outline';
    case 'partially_refunded':
      return 'secondary';
    case 'failed':
    case 'refunded':
      return 'destructive';
  }
}

export function PaymentStatusBadge({
  status,
}: {
  status: TransactionStatus;
}): React.ReactElement {
  const { t } = useTranslation('payments');
  return <Badge variant={paymentVariant(status)}>{t(`status.${status}`)}</Badge>;
}
