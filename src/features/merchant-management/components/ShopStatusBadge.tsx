import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { ShopStatus } from '@/features/merchant-management/types/shop';
import { Badge } from '@/shared/components/ui/badge';

function statusVariant(
  status: ShopStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'rejected' || status === 'suspended') return 'destructive';
  if (status === 'pending') return 'outline';
  return 'default';
}

export function ShopStatusBadge({ status }: { status: ShopStatus }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  return <Badge variant={statusVariant(status)}>{t(`status.${status}`)}</Badge>;
}
