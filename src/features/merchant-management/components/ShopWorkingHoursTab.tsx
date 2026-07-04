import type React from 'react';

import { ShopWorkingHoursEditor } from '@/features/merchant-management/components/ShopWorkingHoursEditor';

export function ShopWorkingHoursTab({
  merchantId,
}: {
  merchantId: string;
}): React.ReactElement {
  return <ShopWorkingHoursEditor merchantId={merchantId} />;
}
