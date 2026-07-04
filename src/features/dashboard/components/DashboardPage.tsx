import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BookingStatusChart } from '@/features/dashboard/components/BookingStatusChart';
import { CustomerGrowthChart } from '@/features/dashboard/components/CustomerGrowthChart';
import { DailyBookingsChart } from '@/features/dashboard/components/DailyBookingsChart';
import { KpiCardGrid } from '@/features/dashboard/components/KpiCardGrid';
import { MonthlyRevenueChart } from '@/features/dashboard/components/MonthlyRevenueChart';
import { RecentActivityPanel } from '@/features/dashboard/components/RecentActivityPanel';
import { TopServicesChart } from '@/features/dashboard/components/TopServicesChart';
import { TopShopsChart } from '@/features/dashboard/components/TopShopsChart';
import { ResponsiveGrid } from '@/shared/components/layout/ResponsiveGrid';
import { layout, typography } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export function DashboardPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');

  return (
    <div className={layout.pageStack} data-testid="dashboard-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </header>

      <KpiCardGrid />

      <ResponsiveGrid preset="twoColumnCharts">
        <DailyBookingsChart />
        <MonthlyRevenueChart />
        <TopServicesChart />
        <TopShopsChart />
        <CustomerGrowthChart />
        <BookingStatusChart />
      </ResponsiveGrid>

      <RecentActivityPanel />
    </div>
  );
}
