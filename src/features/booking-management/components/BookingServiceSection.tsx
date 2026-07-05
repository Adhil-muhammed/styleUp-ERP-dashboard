import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { formatInr } from '@/features/dashboard/lib/formatters';

type BookingServiceSectionProps = {
  data: BookingDetail;
};

export function BookingServiceSection({ data }: BookingServiceSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const service = data.service;

  if (!service) {
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-medium">{t('details.service')}</h3>
        <p className="text-sm text-muted-foreground">{t('details.noServiceInfo')}</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.service')}</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">{t('details.serviceName')}</dt>
          <dd className="font-medium">{service.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('details.category')}</dt>
          <dd>{service.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('details.duration')}</dt>
          <dd>{t('details.durationMinutes', { count: service.durationMinutes })}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('details.price')}</dt>
          <dd>{formatInr(service.price)}</dd>
        </div>
      </dl>
    </section>
  );
}
