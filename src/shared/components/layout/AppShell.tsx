import type React from 'react';
import { Outlet } from 'react-router-dom';

import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { Header } from '@/shared/components/layout/Header';
import { Sidebar } from '@/shared/components/layout/Sidebar';

export function AppShell(): React.ReactElement {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
