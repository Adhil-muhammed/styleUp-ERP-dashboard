import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type BookingSpecialistSectionProps = {
  data: BookingDetail;
};

export function BookingSpecialistSection({
  data,
}: BookingSpecialistSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.specialist')}</h3>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback>{initials(data.staffName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-0.5">
          <p className="font-medium">{data.staffName}</p>
          <p className="text-sm text-muted-foreground">{data.shopName}</p>
        </div>
      </div>
    </section>
  );
}
