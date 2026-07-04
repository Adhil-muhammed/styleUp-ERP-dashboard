---
name: dashboard-responsive
description: Use this skill whenever building, editing, or reviewing any component in the StyleUp ERP admin dashboard (KPI cards, charts, tables, activity panels, layout shells, filters). Ensures all responsive behavior pulls from the shared theme and breakpoint system instead of ad-hoc styles.
---

# Dashboard Responsive Skill

## When to use

Any task touching dashboard UI: new module page, new chart, new card, new table, layout refactor, or responsive bug fix.

## Steps

1. Check [`src/theme/responsive.ts`](../../src/theme/responsive.ts) for existing grid, spacing, breakpoint, and typography tokens before writing any className.
2. For JavaScript breakpoint logic, use `useResponsive()` from `@/shared/hooks/use-responsive` — never `matchMedia` or `window.innerWidth` in components. The singleton store in `src/shared/lib/responsive-store.ts` owns the single resize listener.
3. Reuse shared components first: `KpiCard`, `Card`, `ResponsiveGrid`, `ChartContainer`, `Skeleton`, `TruncatedText`. Do not create new variants unless none exist.
4. For new charts: use `ChartContainer` + `useChartResponsive` hook (which consumes `useResponsive` internally). Define both desktop and mobile behavior via theme `chart.mobileConfig`, not duplicated logic.
5. For new tables: use `ResponsiveTable` — it auto-switches to card view below md via `useResponsive`. Do not build a separate mobile table manually.
6. For new grids/sections: use `ResponsiveGrid` with a `preset` prop (`kpiCards`, `twoColumnCharts`, `activityPanels`) instead of writing raw grid-cols classes.
7. For navigation below lg: use the `SidebarProvider` + Sheet drawer pattern in `AppShell`; persistent sidebar at lg+.
8. For tabbed panels on mobile: prefer Accordion below lg, Tabs at lg+ (see `RecentActivityPanel`).
9. After implementation, verify at sm/md/lg/xl using browser devtools.
10. If a genuinely new responsive pattern is needed, add the token/utility to `src/theme/responsive.ts` first, document it here, then use it.

## Anti-patterns to reject

- Inline media queries
- Fixed px widths/heights on containers or charts
- Manually duplicated mobile/desktop versions of the same component
- New card/table markup instead of reusing shared components
- Arbitrary Tailwind values (p-[17px], w-[342px], min-[480px])
