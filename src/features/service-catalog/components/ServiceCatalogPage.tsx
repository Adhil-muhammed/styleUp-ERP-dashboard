import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceCatalogTabs } from '@/features/service-catalog/components/ServiceCatalogTabs';
import { cn } from '@/shared/lib/utils';
import { layout, typography } from '@/theme/responsive';

export function ServiceCatalogPage(): React.ReactElement {
  const { t } = useTranslation('service-catalog');

  return (
    <div className={layout.pageStack} data-testid="service-catalog-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </header>

      <ServiceCatalogTabs />
    </div>
  );
}
