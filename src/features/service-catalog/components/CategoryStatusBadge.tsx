import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CategoryStatus } from '@/features/service-catalog/types/category';
import { Badge } from '@/shared/components/ui/badge';

export function CategoryStatusBadge({ status }: { status: CategoryStatus }): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {t(`status.${status}`)}
    </Badge>
  );
}
