import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingDetail } from '@/features/booking-management/types/booking-detail';

type BookingPackageSectionProps = {
  data: BookingDetail;
};

export function BookingPackageSection({ data }: BookingPackageSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const pkg = data.package;

  if (!pkg) {
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-medium">{t('details.package')}</h3>
        <p className="text-sm text-muted-foreground">{t('details.noPackageInfo')}</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.package')}</h3>
      <p className="text-sm font-medium">{pkg.name}</p>
      <div>
        <p className="mb-2 text-xs text-muted-foreground">{t('details.includedServices')}</p>
        <ul className="space-y-1 text-sm">
          {pkg.includedServices.map((item) => (
            <li key={item.name} className="flex justify-between gap-2">
              <span>{item.name}</span>
              <span className="text-muted-foreground">
                {t('details.durationMinutes', { count: item.durationMinutes })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
