import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useTopShopsChartQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';

const chartConfig = {
  value: { label: 'Bookings', color: 'var(--chart-4)' },
} satisfies ChartConfig;

export function TopShopsChart(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { isCompact, chartContainerClass, skeletonClass, height } = useChartResponsive();
  const { data, isPending, isError, error } = useTopShopsChartQuery();

  const localizedConfig: ChartConfig = {
    value: { ...chartConfig.value, label: t('charts.topShops.bookings') },
  };

  const chartData = data?.data.map((item, index) => ({
    ...item,
    label: `#${index + 1} ${item.name}`,
  }));

  return (
    <ChartContainer
      title={t('charts.topShops.title')}
      description={t('charts.topShops.description')}
      isLoading={isPending}
      isError={isError}
      errorMessage={error?.message}
      isEmpty={!chartData?.length}
      emptyMessage={t('empty.chart')}
      skeletonClassName={skeletonClass}
    >
      {chartData ? (
        <RechartsChartContainer
          config={localizedConfig}
          className={chartContainerClass}
          initialDimension={{ width: 320, height }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 8, left: isCompact ? 4 : 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={isCompact ? 72 : 140}
              tick={{ fontSize: isCompact ? 10 : 12 }}
            />
            <ChartTooltip wrapperStyle={{ zIndex: 50 }} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </RechartsChartContainer>
      ) : null}
    </ChartContainer>
  );
}
