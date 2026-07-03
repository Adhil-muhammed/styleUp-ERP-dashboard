import { useAbility } from '@casl/react';

import type { AppAbility } from '@/shared/lib/casl-ability';

export function usePermissions(): AppAbility {
  return useAbility<AppAbility>();
}
