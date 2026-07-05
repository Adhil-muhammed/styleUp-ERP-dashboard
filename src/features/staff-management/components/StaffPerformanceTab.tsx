import { useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useStaffPerformanceQuery } from '@/features/staff-management/hooks/use-staff-management-queries';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { KpiCard } from '@/shared/components/kpi/KpiCard';
import { ResponsiveGrid } from '@/shared/components/layout/ResponsiveGrid';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { CalendarCheck, CalendarX, Star, Users } from 'lucide-react';

const chartConfig = {
  bookings: { label: 'Bookings', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

type StaffPerformanceTabProps = {
  staffId: string;
};

export function StaffPerformanceTab({ staffId }: StaffPerformanceTabProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const [period, setPeriod] = useState<7 | 30>(7);
  const { chartContainerClass, skeletonClass, height } = useChartResponsive();
  const { data, isPending, isError, error } = useStaffPerformanceQuery(staffId, period);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-64 w-full" />}
    >
      {data ? (
        <div className="space-y-6">
          <ToggleGroup
            type="single"
            value={String(period)}
            onValueChange={(value) => {
              if (value === '7' || value === '30') setPeriod(Number(value) as 7 | 30);
            }}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="7">{t('performance.period7')}</ToggleGroupItem>
            <ToggleGroupItem value="30">{t('performance.period30')}</ToggleGroupItem>
          </ToggleGroup>

          <ResponsiveGrid preset="kpiCards">
            <KpiCard
              label={t('performance.totalBookings')}
              value={String(data.kpis.totalBookings)}
              icon={Users}
            />
            <KpiCard
              label={t('performance.completionRate')}
              value={`${data.kpis.completionRate}%`}
              icon={CalendarCheck}
            />
            <KpiCard
              label={t('performance.averageRating')}
              value={data.kpis.averageRating.toFixed(1)}
              icon={Star}
            />
            <KpiCard
              label={t('performance.cancellations')}
              value={String(data.kpis.cancellations)}
              icon={CalendarX}
            />
          </ResponsiveGrid>

          <ChartContainer
            title={t('performance.bookingsTrend')}
            isLoading={false}
            isError={Boolean(error)}
            errorMessage={error?.message}
            isEmpty={!data.data.length}
            emptyMessage={t('empty.performance')}
            skeletonClassName={skeletonClass}
          >
            <RechartsChartContainer config={chartConfig} className={chartContainerClass}>
              <LineChart data={data.data} height={height}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickFormatter={formatDateLabel} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} />
              </LineChart>
            </RechartsChartContainer>
          </ChartContainer>
        </div>
      ) : null}
    </QuerySection>
  );
}
