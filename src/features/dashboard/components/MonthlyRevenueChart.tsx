import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useMonthlyRevenueChartQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import { formatInr, formatInrCompact } from '@/features/dashboard/lib/formatters';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';

const chartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function formatMonthLabel(month: string, compact: boolean): string {
  const [year, monthNum] = month.split('-');
  const parsed = new Date(Number(year), Number(monthNum) - 1);
  if (compact) {
    return parsed.toLocaleDateString('en-IN', { month: 'short' });
  }
  return parsed.toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit',
  });
}

export function MonthlyRevenueChart(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { isCompact, isMobile, chartContainerClass, skeletonClass, height } = useChartResponsive();
  const { data, isPending, isError, error } = useMonthlyRevenueChartQuery();

  const localizedConfig: ChartConfig = {
    revenue: { ...chartConfig.revenue, label: t('charts.monthlyRevenue.revenue') },
  };

  return (
    <ChartContainer
      title={t('charts.monthlyRevenue.title')}
      description={t('charts.monthlyRevenue.description')}
      isLoading={isPending}
      isError={isError}
      errorMessage={error?.message}
      isEmpty={!data?.data.length}
      emptyMessage={t('empty.chart')}
      skeletonClassName={skeletonClass}
    >
      {data ? (
        <RechartsChartContainer
          config={localizedConfig}
          className={chartContainerClass}
          initialDimension={{ width: 320, height }}
        >
          <BarChart
            data={data.data}
            margin={{ top: 8, right: isCompact ? 4 : 8, left: 0, bottom: isMobile ? 4 : 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickFormatter={(month: string) => formatMonthLabel(month, isCompact)}
              interval={isCompact ? 'preserveStartEnd' : 0}
              minTickGap={isCompact ? 32 : 16}
              tick={{ fontSize: isCompact ? 10 : 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={isCompact ? 36 : 56}
              tickFormatter={isCompact ? formatInrCompact : formatInr}
              tick={{ fontSize: isCompact ? 10 : 12 }}
            />
            <ChartTooltip
              wrapperStyle={{ zIndex: 50 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => (typeof value === 'number' ? formatInr(value) : value)}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} maxBarSize={isCompact ? 24 : 40} />
          </BarChart>
        </RechartsChartContainer>
      ) : null}
    </ChartContainer>
  );
}
