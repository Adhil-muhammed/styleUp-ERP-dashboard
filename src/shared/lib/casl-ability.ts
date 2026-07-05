import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';

import { PERMISSIONS } from '@/shared/config/permissions';
import type { UserRole } from '@/shared/types/auth';

export type AppAbility = MongoAbility<[string, string]>;

function collectPermissionValues(obj: Record<string, unknown>): string[] {
  const values: string[] = [];
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') {
      values.push(value);
    } else if (value && typeof value === 'object') {
      values.push(...collectPermissionValues(value as Record<string, unknown>));
    }
  }
  return values;
}

function grantPermissions(
  can: AbilityBuilder<AppAbility>['can'],
  permissions: string[],
): void {
  for (const permission of permissions) {
    const action = permission.split(':').pop();
    if (action) {
      can(action, permission);
    }
  }
}

const SHOP_OWNER_PERMISSIONS = [
  PERMISSIONS.dashboard.view,
  PERMISSIONS.staff.view,
  PERMISSIONS.staff.manage,
  PERMISSIONS.bookings.view,
  PERMISSIONS.bookings.manage,
  PERMISSIONS.services.view,
  PERMISSIONS.services.manage,
  PERMISSIONS.reviews.view,
  PERMISSIONS.reviews.manage,
  PERMISSIONS.payments.view,
  PERMISSIONS.payments.manage,
] as const;

export function defineAbilityFor(role?: UserRole): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!role) {
    return build();
  }

  if (role === 'super_admin') {
    grantPermissions(can, collectPermissionValues(PERMISSIONS));
    return build();
  }

  if (role === 'shop_owner') {
    grantPermissions(can, [...SHOP_OWNER_PERMISSIONS]);
    return build();
  }

  return build();
}

export const defaultAbility = defineAbilityFor('super_admin');
