import type React from 'react';

import { SidebarToggle } from '@/shared/components/layout/SidebarToggle';
import { APP_NAME } from '@/shared/lib/constants';
import { cn } from '@/shared/lib/utils';
import { zIndex } from '@/theme/responsive';

export function Header(): React.ReactElement {
  return (
    <header
      className={cn(
        'sticky top-0 flex shrink-0 items-center gap-3 border-b border-border bg-background px-4 py-3 lg:px-6 lg:py-4',
        zIndex.stickyHeader,
      )}
      data-testid="app-header"
    >
      <SidebarToggle variant="mobile" />
      <span className="text-sm font-medium sm:text-base">{APP_NAME}</span>
    </header>
  );
}
