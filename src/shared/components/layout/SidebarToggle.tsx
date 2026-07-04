import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { useSidebar } from '@/shared/lib/sidebar-context';
import { getSidebarMode } from '@/shared/lib/sidebar-mode';
import { cn } from '@/shared/lib/utils';

type SidebarToggleProps = {
  variant: 'mobile' | 'sidebar';
  className?: string;
};

export function SidebarToggle({
  variant,
  className,
}: SidebarToggleProps): React.ReactElement {
  const { t } = useTranslation('common');
  const { width } = useResponsive();
  const mode = getSidebarMode(width);
  const {
    isCollapsed,
    isTabletExpanded,
    open,
    toggleCollapsed,
    toggleTabletExpanded,
  } = useSidebar();

  if (variant === 'mobile') {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('md:hidden', className)}
        aria-label={t('nav.toggle')}
        aria-controls="app-sidebar"
        aria-expanded={false}
        onClick={open}
      >
        <MenuIcon />
      </Button>
    );
  }

  const isExpanded = mode === 'tablet' ? isTabletExpanded : !isCollapsed;
  const handleToggle = (): void => {
    if (mode === 'tablet') {
      toggleTabletExpanded();
      return;
    }
    toggleCollapsed();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn('hidden md:flex', className)}
      aria-label={t('nav.toggle')}
      aria-controls="app-sidebar"
      aria-expanded={isExpanded}
      onClick={handleToggle}
    >
      {isExpanded ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
    </Button>
  );
}
