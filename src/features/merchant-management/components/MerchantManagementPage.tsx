import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ShopTable } from '@/features/merchant-management/components/ShopTable';
import { cn } from '@/shared/lib/utils';
import { layout, typography } from '@/theme/responsive';

export function MerchantManagementPage(): React.ReactElement {
  const { t } = useTranslation('merchant-management');

  return (
    <div className={layout.pageStack} data-testid="merchant-management-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </header>
      <ShopTable />
    </div>
  );
}
