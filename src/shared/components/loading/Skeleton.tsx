import type React from 'react';
export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps): React.ReactElement {
  return <div className={className} data-testid="skeleton" />;
}
