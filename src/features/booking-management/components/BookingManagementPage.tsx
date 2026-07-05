import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BookingTable } from '@/features/booking-management/components/BookingTable';
import { useScope } from '@/shared/hooks/use-scope';
import { layout, typography } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export function BookingManagementPage(): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { merchantId, isAdmin } = useScope();

  const scopeLabel =
    merchantId === null
      ? t('scope.allShops')
      : t('scope.singleShop', { shopId: merchantId });

  return (
    <div className={layout.pageStack} data-testid="booking-management-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? t('page.subtitleAdmin', { scope: scopeLabel }) : t('page.subtitleOwner')}
        </p>
      </header>

      <BookingTable />
    </div>
  );
}
