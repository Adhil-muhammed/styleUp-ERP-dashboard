import { useMemo, useSyncExternalStore } from 'react';

import {
  getBreakpointName,
  getDeviceFlags,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type BreakpointName,
} from '@/shared/lib/responsive-store';

export type ResponsiveState = {
  width: number;
  breakpoint: BreakpointName;
  isBelowSm: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
};

export function useResponsive(): ResponsiveState {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const deviceFlags = getDeviceFlags(width);

    return {
      width,
      breakpoint: getBreakpointName(width),
      ...deviceFlags,
    };
  }, [width]);
}
