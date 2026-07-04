import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';

import { PERMISSIONS } from '@/shared/config/permissions';

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

// TODO: replace with role-based rules when auth is wired
export function defineAbilityFor(_role?: string): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  for (const permission of collectPermissionValues(PERMISSIONS)) {
    const action = permission.split(':').pop();
    if (action) {
      can(action, permission);
    }
  }

  return build();
}

export const defaultAbility = defineAbilityFor();
