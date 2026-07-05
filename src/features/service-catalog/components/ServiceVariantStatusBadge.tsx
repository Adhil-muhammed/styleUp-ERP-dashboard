import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { ServiceVariantStatus } from '@/features/service-catalog/types/service-variant';
import { Badge } from '@/shared/components/ui/badge';

export function ServiceVariantStatusBadge({
  status,
}: {
  status: ServiceVariantStatus;
}): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {t(`status.${status}`)}
    </Badge>
  );
}
