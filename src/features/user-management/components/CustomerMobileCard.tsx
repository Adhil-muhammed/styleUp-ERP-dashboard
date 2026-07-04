import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomerAvatar } from '@/features/user-management/components/CustomerAvatar';
import { CustomerStatusBadge } from '@/features/user-management/components/CustomerStatusBadge';
import type { CustomerListItem } from '@/features/user-management/types/customer';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type CustomerMobileCardProps = {
  customer: CustomerListItem;
  actions?: React.ReactNode;
};

export function CustomerMobileCard({
  customer,
  actions,
}: CustomerMobileCardProps): React.ReactElement {
  const { t } = useTranslation('user-management');

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="customer-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar name={customer.name} avatarUrl={customer.avatarUrl} />
          <div className="min-w-0 space-y-1">
            <TruncatedText text={customer.name} className="font-medium" />
            <TruncatedText text={customer.email} className="text-sm text-muted-foreground" />
          </div>
        </div>
        {actions}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">{t('columns.phone')}: </span>
          <TruncatedText text={customer.phone} />
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.country')}: </span>
          {customer.country}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.xp')}: </span>
          {customer.xp.toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.level')}: </span>
          {customer.level}
        </div>
      </div>
      <div className="mt-2">
        <CustomerStatusBadge status={customer.status} />
      </div>
    </div>
  );
}
