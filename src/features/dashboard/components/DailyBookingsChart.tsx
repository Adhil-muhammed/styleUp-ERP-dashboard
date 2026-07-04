import { useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useDailyBookingsChartQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import { formatInr } from '@/features/dashboard/lib/formatters';
import type { DailyBookingsPeriod } from '@/features/dashboard/types/dashboard-charts';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';

const chartConfig = {
  bookings: { label: 'Bookings', color: 'var(--chart-1)' },
  revenue: { label: 'Revenue', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function formatDateLabel(date: string, compact: boolean): string {
  const parsed = new Date(date);
  if (compact) {
    return parsed.toLocaleDateString('en-IN', { day: 'numeric' });
  }
  return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function DailyBookingsChart(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { isCompact, isMobile, mobileConfig, chartContainerClass, skeletonClass, height } =
    useChartResponsive();
  const [period, setPeriod] = useState<DailyBookingsPeriod>(7);
  const { data, isPending, isError, error } = useDailyBookingsChartQuery(period);

  const hideSecondary = isCompact && mobileConfig.hideSecondaryAxis;
  const hideLegend = isMobile && mobileConfig.hideLegend;
  const simplifySeries = isMobile && mobileConfig.simplifySeries;
  const showRevenue = !hideSecondary && !simplifySeries;
  const useAngledLabels = isCompact && period === 30;

  const localizedConfig: ChartConfig = {
    bookings: { ...chartConfig.bookings, label: t('charts.dailyBookings.bookings') },
    revenue: { ...chartConfig.revenue, label: t('charts.dailyBookings.revenue') },
  };

  return (
    <ChartContainer
      title={t('charts.dailyBookings.title')}
      description={t('charts.dailyBookings.description')}
      isLoading={isPending}
      isError={isError}
      errorMessage={error?.message}
      isEmpty={!data?.data.length}
      emptyMessage={t('empty.chart')}
      skeletonClassName={skeletonClass}
      action={
        <ToggleGroup
          type="single"
          value={String(period)}
          onValueChange={(value) => {
            if (value === '7' || value === '30') {
              setPeriod(Number(value) as DailyBookingsPeriod);
            }
          }}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="7" className="flex-1 sm:flex-none">
            {t('charts.dailyBookings.period7')}
          </ToggleGroupItem>
          <ToggleGroupItem value="30" className="flex-1 sm:flex-none">
            {t('charts.dailyBookings.period30')}
          </ToggleGroupItem>
        </ToggleGroup>
      }
    >
      {data ? (
        <RechartsChartContainer
          config={localizedConfig}
          className={chartContainerClass}
          initialDimension={{ width: 320, height }}
        >
          <ComposedChart
            data={data.data}
            margin={{
              top: 8,
              right: showRevenue ? 8 : 4,
              left: 0,
              bottom: useAngledLabels ? 20 : 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(date: string) => formatDateLabel(date, isCompact)}
              minTickGap={isCompact ? 40 : 24}
              interval={isCompact ? 'preserveStartEnd' : 0}
              angle={useAngledLabels ? -45 : 0}
              textAnchor={useAngledLabels ? 'end' : 'middle'}
              height={useAngledLabels ? 48 : 30}
              tick={{ fontSize: isCompact ? 10 : 12 }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              width={isCompact ? 28 : 40}
              tick={{ fontSize: isCompact ? 10 : 12 }}
            />
            {showRevenue ? (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={isCompact ? 48 : 56}
                tickFormatter={(value: number) => formatInr(value)}
                tick={{ fontSize: isCompact ? 10 : 12 }}
              />
            ) : null}
            <ChartTooltip
              wrapperStyle={{ zIndex: 50 }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'revenue' && typeof value === 'number') {
                      return formatInr(value);
                    }
                    return value;
                  }}
                />
              }
            />
            {!hideLegend ? (
              <ChartLegend content={<ChartLegendContent className="flex-wrap gap-2" />} />
            ) : null}
            <Bar yAxisId="left" dataKey="bookings" fill="var(--color-bookings)" radius={4} />
            {showRevenue ? (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            ) : null}
          </ComposedChart>
        </RechartsChartContainer>
      ) : null}
    </ChartContainer>
  );
}
