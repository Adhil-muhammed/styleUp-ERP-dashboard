import type React from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentKpiCards } from '@/features/payments/components/PaymentKpiCards';
import { SettlementSummaryTable } from '@/features/payments/components/SettlementSummaryTable';
import { TransactionTable } from '@/features/payments/components/TransactionTable';
import { useScope } from '@/shared/hooks/use-scope';
import { layout, typography } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export function PaymentsPage(): React.ReactElement {
  const { t } = useTranslation('payments');
  const { merchantId, isAdmin } = useScope();

  const scopeLabel =
    merchantId === null
      ? t('scope.allShops')
      : t('scope.singleShop', { shopId: merchantId });

  return (
    <div className={layout.pageStack} data-testid="payments-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? t('page.subtitleAdmin', { scope: scopeLabel }) : t('page.subtitleOwner')}
        </p>
      </header>

      <PaymentKpiCards />
      <TransactionTable />
      <SettlementSummaryTable />
    </div>
  );
}
