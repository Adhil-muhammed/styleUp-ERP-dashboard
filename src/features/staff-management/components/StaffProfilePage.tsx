import type React from 'react';
import { useParams } from 'react-router-dom';

import { StaffProfileHeader } from '@/features/staff-management/components/StaffProfileHeader';
import { StaffProfileTabs } from '@/features/staff-management/components/StaffProfileTabs';
import { layout } from '@/theme/responsive';

export function StaffProfilePage(): React.ReactElement {
  const { staffId = '' } = useParams<{ staffId: string }>();

  return (
    <div className={layout.pageStack} data-testid="staff-profile-page">
      <StaffProfileHeader staffId={staffId} />
      <StaffProfileTabs staffId={staffId} />
    </div>
  );
}
