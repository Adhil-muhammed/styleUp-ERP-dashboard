import type React from 'react';
import { useTranslation } from 'react-i18next';

import { DASHBOARD_NAV_ITEM, NAV_GROUPS } from '@/shared/config/navigation';
import { SidebarGroup } from '@/shared/components/layout/SidebarGroup';
import { SidebarItem } from '@/shared/components/layout/SidebarItem';
import { SidebarToggle } from '@/shared/components/layout/SidebarToggle';
import { cn } from '@/shared/lib/utils';
import { layout, nav } from '@/theme/responsive';

export type SidebarContentProps = {
  className?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  showToggle?: boolean;
};

export function SidebarContent({
  className,
  collapsed = false,
  onNavigate,
  showToggle = false,
}: SidebarContentProps): React.ReactElement {
  const { t } = useTranslation('common');

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      {showToggle ? (
        <div className={cn('flex shrink-0 items-center border-b border-sidebar-border', nav.railPadding, collapsed ? 'justify-center' : 'justify-end')}>
          <SidebarToggle variant="sidebar" />
        </div>
      ) : null}
      <nav
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto',
          nav.railPadding,
          nav.groupGap,
        )}
        data-testid="sidebar-content"
        aria-label={t('nav.title')}
      >
        <SidebarGroup collapsed={collapsed}>
          <SidebarItem
            to={DASHBOARD_NAV_ITEM.to}
            icon={DASHBOARD_NAV_ITEM.icon}
            label={t(DASHBOARD_NAV_ITEM.labelKey)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </SidebarGroup>

        {NAV_GROUPS.map((group) => (
          <SidebarGroup
            key={group.id}
            label={t(group.labelKey)}
            collapsed={collapsed}
          >
            {group.items.map((item) => (
              <SidebarItem
                key={item.id}
                to={item.to}
                icon={item.icon}
                label={t(item.labelKey)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarGroup>
        ))}
      </nav>
    </div>
  );
}

type SidebarProps = {
  collapsed?: boolean;
  className?: string;
};

export function Sidebar({ collapsed = false, className }: SidebarProps): React.ReactElement {
  return (
    <aside
      id="app-sidebar"
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200',
        layout.sidebarHeight,
        collapsed ? nav.sidebarWidthCollapsed : nav.sidebarWidth,
        className,
      )}
      data-testid="app-sidebar"
    >
      <SidebarContent collapsed={collapsed} showToggle />
    </aside>
  );
}
