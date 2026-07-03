import type React from 'react';
import { Button } from '@/shared/components/ui/button';

export function DashboardPage(): React.ReactElement {
  return (
    <div data-testid="dashboard-page">
      <Button type="button">StyleUp ERP</Button>
    </div>
  );
}
