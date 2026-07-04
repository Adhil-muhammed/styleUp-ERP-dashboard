import type React from 'react';
import { useParams } from 'react-router-dom';

import { CustomerProfileHeader } from '@/features/user-management/components/CustomerProfileHeader';
import { CustomerProfileTabs } from '@/features/user-management/components/CustomerProfileTabs';
import { layout } from '@/theme/responsive';

export function CustomerProfilePage(): React.ReactElement {
  const { customerId = '' } = useParams<{ customerId: string }>();

  return (
    <div className={layout.pageStack} data-testid="customer-profile-page">
      <CustomerProfileHeader customerId={customerId} />
      <CustomerProfileTabs customerId={customerId} />
    </div>
  );
}
