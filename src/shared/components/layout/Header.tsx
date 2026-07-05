import { LogOut } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ShopSwitcher } from '@/shared/components/layout/ShopSwitcher';
import { SidebarToggle } from '@/shared/components/layout/SidebarToggle';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/lib/auth-store';
import { APP_NAME } from '@/shared/lib/constants';
import { signOut } from '@/shared/lib/sign-out';
import { cn } from '@/shared/lib/utils';
import { zIndex } from '@/theme/responsive';

export function Header(): React.ReactElement {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleLogout = (): void => {
    signOut({ redirect: false });
    void navigate(ROUTES.login, { replace: true });
  };

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

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ShopSwitcher />
        {user ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
        ) : null}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="size-4" />
          <span className="hidden sm:inline">{t('nav.logout')}</span>
        </Button>
      </div>
    </header>
  );
}
