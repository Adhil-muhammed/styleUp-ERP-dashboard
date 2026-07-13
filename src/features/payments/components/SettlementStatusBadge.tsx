import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { SettlementStatus } from '@/features/payments/types/settlement';
import { Badge } from '@/shared/components/ui/badge';

function settlementVariant(
  status: SettlementStatus,
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'paid':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'pending':
      return 'outline';
  }
}

export function SettlementStatusBadge({
  status,
}: {
  status: SettlementStatus;
}): React.ReactElement {
  const { t } = useTranslation('payments');
  return <Badge variant={settlementVariant(status)}>{t(`settlement.status.${status}`)}</Badge>;
}
