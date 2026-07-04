import type React from 'react';
import { useParams } from 'react-router-dom';

import { MerchantProfileHeader } from '@/features/merchant-management/components/MerchantProfileHeader';
import { MerchantProfileTabs } from '@/features/merchant-management/components/MerchantProfileTabs';
import { layout } from '@/theme/responsive';

export function MerchantProfilePage(): React.ReactElement {
  const { merchantId = '' } = useParams<{ merchantId: string }>();

  return (
    <div className={layout.pageStack} data-testid="merchant-profile-page">
      <MerchantProfileHeader merchantId={merchantId} />
      <MerchantProfileTabs merchantId={merchantId} />
    </div>
  );
}
