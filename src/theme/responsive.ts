// Shared responsive theme tokens — single source of truth for all dashboard components

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const spacing = {
  cardGap: 'gap-4 md:gap-6',
  sectionGap: 'gap-6 md:gap-8',
  pagePadding: 'p-4 md:p-6 lg:p-8',
} as const;

export const grid = {
  kpiCards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6',
  twoColumnCharts: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  activityPanels: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6',
} as const;

export const typography = {
  kpiValue: 'text-xl sm:text-2xl lg:text-3xl font-semibold',
  kpiLabel: 'text-xs sm:text-sm text-muted-foreground',
  sectionTitle: 'text-base sm:text-lg font-medium',
} as const;

export const zIndex = {
  stickyHeader: 'z-40',
  drawer: 'z-50',
  tooltip: 'z-60',
} as const;

export const chart = {
  heightDesktop: 320,
  heightMobile: 220,
  mobileConfig: {
    hideLegend: true,
    hideSecondaryAxis: true,
    simplifySeries: true,
  },
} as const;

export const chartClasses = {
  container: 'h-52 w-full min-h-0 sm:h-60 md:h-64 lg:h-72',
  skeleton: 'h-52 w-full rounded-lg sm:h-60 md:h-64 lg:h-72',
} as const;

export const layout = {
  pageStack: 'space-y-4 md:space-y-6',
  shell: 'flex h-dvh overflow-hidden',
  contentColumn: 'flex min-h-0 min-w-0 flex-1 flex-col',
  mainScroll: 'min-h-0 flex-1 overflow-y-auto',
  sidebarHeight: 'h-dvh shrink-0',
} as const;

export const nav = {
  sidebarWidth: 'w-64',
  sidebarWidthCollapsed: 'w-16',
  sidebarRailOffset: 'pl-16',
  mobileMenuBreakpoint: 'lg',
  itemGap: 'gap-1',
  groupGap: 'gap-4',
  itemPadding: 'px-3 py-2',
  iconSize: 'size-4',
  railPadding: 'p-2',
} as const;

export const table = {
  breakpointToCardView: 'md',
} as const;
