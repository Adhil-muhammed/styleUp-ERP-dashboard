import { useResponsive } from '@/shared/hooks/use-responsive';
import { breakpoints, chart, chartClasses } from '@/theme/responsive';

export function useChartResponsive(): {
  isCompact: boolean;
  isMobile: boolean;
  height: number;
  mobileConfig: typeof chart.mobileConfig;
  chartContainerClass: string;
  skeletonClass: string;
} {
  const { width, isBelowSm } = useResponsive();
  const isCompact = width < breakpoints.md;

  return {
    isCompact,
    isMobile: isBelowSm,
    height: isCompact ? chart.heightMobile : chart.heightDesktop,
    mobileConfig: chart.mobileConfig,
    chartContainerClass: chartClasses.container,
    skeletonClass: chartClasses.skeleton,
  };
}
