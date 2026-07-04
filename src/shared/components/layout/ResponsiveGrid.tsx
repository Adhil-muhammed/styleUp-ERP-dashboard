import type { ReactNode } from 'react';
import type React from 'react';

import { cn } from '@/shared/lib/utils';
import { grid } from '@/theme/responsive';

export type GridPreset = keyof typeof grid;

export interface ResponsiveGridProps {
  preset: GridPreset;
  className?: string;
  children: ReactNode;
}

export function ResponsiveGrid({
  preset,
  className,
  children,
}: ResponsiveGridProps): React.ReactElement {
  return (
    <div className={cn(grid[preset], className)} data-testid="responsive-grid">
      {children}
    </div>
  );
}
