import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';

export type AppAbility = MongoAbility<[string, string]>;

export function defineAbilityFor(_role?: string): AppAbility {
  const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  return build();
}

export const defaultAbility = defineAbilityFor();
