import type React from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { usePermissions } from '@/shared/hooks/use-permissions';

export type RequirePermissionProps = {
  action: string;
  subject: string;
  children: React.ReactNode;
};

export function RequirePermission({
  action,
  subject,
  children,
}: RequirePermissionProps): React.ReactElement {
  const ability = usePermissions();

  if (!ability.can(action, subject)) {
    return <Navigate to={ROUTES.permissionDenied} replace />;
  }

  return <>{children}</>;
}
