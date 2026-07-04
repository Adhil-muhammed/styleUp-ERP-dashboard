import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { isNavItemActive } from '@/shared/config/navigation';
import type { RoutePath } from '@/shared/config/routes';
import { Badge } from '@/shared/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { nav } from '@/theme/responsive';

export type SidebarItemProps = {
  to: RoutePath;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  badge?: number;
  onNavigate?: () => void;
};

export function SidebarItem({
  to,
  icon: Icon,
  label,
  collapsed,
  badge,
  onNavigate,
}: SidebarItemProps): React.ReactElement {
  const location = useLocation();
  const isActive = isNavItemActive(location.pathname, to);

  const linkContent = (
    <>
      <Icon className={cn(nav.iconSize, 'shrink-0')} aria-hidden />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge !== undefined && badge > 0 ? (
            <Badge variant="secondary" className="ml-auto shrink-0 tabular-nums">
              {badge > 99 ? '99+' : badge}
            </Badge>
          ) : null}
        </>
      ) : null}
    </>
  );

  const link = (
    <NavLink
      to={to}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative flex items-center rounded-lg text-sm transition-colors outline-none',
        nav.itemPadding,
        collapsed ? 'justify-center gap-0' : 'gap-3',
        isActive
          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
        isActive &&
          'before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary',
      )}
    >
      {linkContent}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
          {badge !== undefined && badge > 0 ? ` (${String(badge)})` : ''}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
