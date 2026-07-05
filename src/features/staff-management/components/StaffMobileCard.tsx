import type React from 'react';
import { useTranslation } from 'react-i18next';

import { StaffAvailabilityBadge } from '@/features/staff-management/components/StaffAvailabilityBadge';
import { StaffStatusBadge } from '@/features/staff-management/components/StaffStatusBadge';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { StarRating } from '@/shared/components/rating/StarRating';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type StaffMobileCardProps = {
  staff: StaffListItem;
  actions?: React.ReactNode;
};

export function StaffMobileCard({ staff, actions }: StaffMobileCardProps): React.ReactElement {
  const { t } = useTranslation('staff-management');

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="staff-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <TruncatedText text={staff.name} className="font-medium" />
          <TruncatedText text={staff.shopName} className="text-sm text-muted-foreground" />
        </div>
        {actions}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">{t('columns.role')}: </span>
          {t(`role.${staff.role}`)}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{t('columns.rating')}: </span>
          <StarRating value={staff.rating} size="sm" showValue />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <StaffAvailabilityBadge availability={staff.availability} />
        <StaffStatusBadge status={staff.status} />
      </div>
    </div>
  );
}
