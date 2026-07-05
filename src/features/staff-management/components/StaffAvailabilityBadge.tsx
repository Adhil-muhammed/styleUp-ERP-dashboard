import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { StaffAvailability } from '@/features/staff-management/types/staff';
import { Badge } from '@/shared/components/ui/badge';

function availabilityVariant(
  availability: StaffAvailability,
): 'default' | 'secondary' | 'outline' {
  if (availability === 'available') return 'default';
  if (availability === 'busy') return 'outline';
  return 'secondary';
}

export function StaffAvailabilityBadge({
  availability,
}: {
  availability: StaffAvailability;
}): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Badge variant={availabilityVariant(availability)}>
      {t(`availability.${availability}`)}
    </Badge>
  );
}
