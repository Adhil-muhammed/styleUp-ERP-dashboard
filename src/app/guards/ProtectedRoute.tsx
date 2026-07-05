import type React from 'react';
import { Navigate } from 'react-router-dom';

import { PageLoader } from '@/shared/components/loading/PageLoader';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/lib/auth-store';

export type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}
