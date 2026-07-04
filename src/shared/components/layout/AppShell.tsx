import { useEffect } from 'react';
import type React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { Header } from '@/shared/components/layout/Header';
import { Sidebar, SidebarContent } from '@/shared/components/layout/Sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { SidebarProvider, useSidebar } from '@/shared/lib/sidebar-context';
import { getSidebarMode } from '@/shared/lib/sidebar-mode';
import { cn } from '@/shared/lib/utils';
import { layout, nav, spacing, zIndex } from '@/theme/responsive';
import { useTranslation } from 'react-i18next';

function TabletSidebarRail({ showOverlay }: { showOverlay: boolean }): React.ReactElement {
  const { collapseTablet } = useSidebar();

  return (
    <>
      <aside
        id="app-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
          nav.sidebarWidthCollapsed,
          zIndex.stickyHeader,
        )}
        data-testid="app-sidebar-rail"
      >
        <SidebarContent collapsed showToggle />
      </aside>

      {showOverlay ? (
        <>
          <button
            type="button"
            className={cn('fixed inset-0 bg-black/40', zIndex.drawer)}
            aria-label="Close navigation"
            onClick={collapseTablet}
          />
          <aside
            className={cn(
              'fixed inset-y-0 left-0 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg',
              nav.sidebarWidth,
              zIndex.drawer,
            )}
            data-testid="app-sidebar-tablet-overlay"
          >
            <SidebarContent onNavigate={collapseTablet} />
          </aside>
        </>
      ) : null}
    </>
  );
}

function AppShellContent(): React.ReactElement {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { width } = useResponsive();
  const mode = getSidebarMode(width);
  const { isOpen, open, close, isCollapsed, isTabletExpanded, collapseTablet } = useSidebar();

  useEffect(() => {
    close();
    collapseTablet();
  }, [location.pathname, close, collapseTablet]);

  const showMobileDrawer = mode === 'mobile' && isOpen;
  const showTabletOverlay = mode === 'tablet' && isTabletExpanded;

  const mainOffsetClass = mode === 'tablet' ? nav.sidebarRailOffset : '';

  return (
    <div className={cn(layout.shell, 'bg-background text-foreground')}>
      {mode === 'desktop' ? <Sidebar collapsed={isCollapsed} /> : null}

      {mode === 'tablet' ? <TabletSidebarRail showOverlay={showTabletOverlay} /> : null}

      {mode === 'mobile' ? (
        <Sheet open={showMobileDrawer} onOpenChange={(nextOpen) => (nextOpen ? open() : close())}>
          <SheetContent
            side="left"
            className={cn(
              nav.sidebarWidth,
              'flex min-h-0 flex-col gap-0 overflow-hidden p-0',
              zIndex.drawer,
            )}
            showCloseButton
          >
            <SheetHeader className="shrink-0 border-b border-sidebar-border px-4 py-3">
              <SheetTitle>{t('nav.title')}</SheetTitle>
            </SheetHeader>
            <SidebarContent className="min-h-0 flex-1" onNavigate={close} />
          </SheetContent>
        </Sheet>
      ) : null}

      <div className={cn(layout.contentColumn, mainOffsetClass)}>
        <Header />
        <Breadcrumbs />
        <main className={cn(layout.mainScroll, spacing.pagePadding)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppShell(): React.ReactElement {
  return (
    <SidebarProvider>
      <AppShellContent />
    </SidebarProvider>
  );
}
