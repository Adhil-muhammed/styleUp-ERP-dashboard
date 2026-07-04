import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerStatus } from '@/features/user-management/types/customer';
import { Badge } from '@/shared/components/ui/badge';

function statusVariant(status: CustomerStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'suspended') return 'destructive';
  if (status === 'pending') return 'outline';
  return 'default';
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }): React.ReactElement {
  const { t } = useTranslation('user-management');
  return <Badge variant={statusVariant(status)}>{t(`status.${status}`)}</Badge>;
}
