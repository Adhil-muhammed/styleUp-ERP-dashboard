import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { StaffStatus } from '@/features/staff-management/types/staff';
import { Badge } from '@/shared/components/ui/badge';

export function StaffStatusBadge({ status }: { status: StaffStatus }): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {t(`status.${status}`)}
    </Badge>
  );
}
