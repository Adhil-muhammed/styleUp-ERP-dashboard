import { AbilityProvider } from '@casl/react';
import { useMemo, type ReactNode } from 'react';
import type React from 'react';

import { useAuthStore } from '@/shared/lib/auth-store';
import { defineAbilityFor } from '@/shared/lib/casl-ability';

type AbilityBridgeProps = {
  children: ReactNode;
};

export function AbilityBridge({ children }: AbilityBridgeProps): React.ReactElement {
  const role = useAuthStore((state) => state.user?.role);

  const ability = useMemo(() => defineAbilityFor(role), [role]);

  return <AbilityProvider value={ability}>{children}</AbilityProvider>;
}
