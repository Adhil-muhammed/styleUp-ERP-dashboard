export const FEATURE_FLAGS = {
  loyaltyProgram: 'loyalty-program',
  mediaLibrary: 'media-library',
  resourceTimeline: 'resource-timeline',
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
