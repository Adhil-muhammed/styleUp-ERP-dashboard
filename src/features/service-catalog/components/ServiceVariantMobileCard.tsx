import type React from 'react';
import { useTranslation } from 'react-i18next';

import { formatInr } from '@/features/dashboard/lib/formatters';
import { ServiceVariantStatusBadge } from '@/features/service-catalog/components/ServiceVariantStatusBadge';
import type { ServiceVariantListItem } from '@/features/service-catalog/types/service-variant';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type ServiceVariantMobileCardProps = {
  variant: ServiceVariantListItem;
  actions?: React.ReactNode;
};

export function ServiceVariantMobileCard({
  variant,
  actions,
}: ServiceVariantMobileCardProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="service-variant-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <TruncatedText text={variant.name} className="font-medium" />
          <TruncatedText text={variant.categoryName} className="text-sm text-muted-foreground" />
        </div>
        {actions}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">{t('columns.gender')}: </span>
          {t(`gender.${variant.gender}`)}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.duration')}: </span>
          {t('list.durationMinutes', { count: variant.durationMinutes })}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.price')}: </span>
          {formatInr(variant.price)}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.sortOrder')}: </span>
          {variant.sortOrder}
        </div>
      </div>
      <div className="mt-2">
        <ServiceVariantStatusBadge status={variant.status} />
      </div>
    </div>
  );
}
