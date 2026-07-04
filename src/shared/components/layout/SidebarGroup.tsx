import type { ReactNode } from 'react';
import type React from 'react';

import { cn } from '@/shared/lib/utils';
import { nav, typography } from '@/theme/responsive';

export type SidebarGroupProps = {
  label?: string;
  collapsed: boolean;
  children: ReactNode;
  className?: string;
};

export function SidebarGroup({
  label,
  collapsed,
  children,
  className,
}: SidebarGroupProps): React.ReactElement {
  return (
    <div className={cn('flex flex-col', nav.itemGap, className)}>
      {label && !collapsed ? (
        <p
          className={cn(
            typography.kpiLabel,
            'px-3 pt-2 font-medium tracking-wide uppercase',
          )}
        >
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}
