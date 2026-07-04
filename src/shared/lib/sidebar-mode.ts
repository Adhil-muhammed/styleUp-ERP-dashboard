import { breakpoints } from '@/theme/responsive';

export type SidebarMode = 'mobile' | 'tablet' | 'desktop';

export function getSidebarMode(width: number): SidebarMode {
  if (width >= breakpoints.lg) {
    return 'desktop';
  }
  if (width >= breakpoints.md) {
    return 'tablet';
  }
  return 'mobile';
}
