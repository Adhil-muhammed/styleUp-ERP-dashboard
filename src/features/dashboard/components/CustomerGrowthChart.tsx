import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomerGrowthChartQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import { formatNumber } from '@/features/dashboard/lib/formatters';
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

const chartConfig = {
  newCustomers: { label: 'New Customers', color: 'var(--chart-1)' },
  cumulativeCustomers: { label: 'Cumulative Customers', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function formatPeriodLabel(period: string): string {
  const [year, monthNum] = period.split('-');
  return new Date(Number(year), Number(monthNum) - 1).toLocaleDateString('en-IN', {
    month: 'short',
  });
}

export function CustomerGrowthChart(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { isMobile, mobileConfig, chartContainerClass, skeletonClass, height } =
    useChartResponsive();
  const { data, isPending, isError, error } = useCustomerGrowthChartQuery();

  const simplifySeries = isMobile && mobileConfig.simplifySeries;
  const hideLegend = isMobile && mobileConfig.hideLegend;

  const localizedConfig: ChartConfig = {
    newCustomers: {
      ...chartConfig.newCustomers,
      label: t('charts.customerGrowth.newCustomers'),
    },
    cumulativeCustomers: {
      ...chartConfig.cumulativeCustomers,
      label: t('charts.customerGrowth.cumulativeCustomers'),
    },
  };

  return (
    <ChartContainer
      title={t('charts.customerGrowth.title')}
      description={t('charts.customerGrowth.description')}
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
          <LineChart data={data.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatPeriodLabel}
            />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={formatNumber} />
            <ChartTooltip wrapperStyle={{ zIndex: 50 }} content={<ChartTooltipContent />} />
            {!hideLegend ? (
              <ChartLegend content={<ChartLegendContent className="flex-wrap gap-2" />} />
            ) : null}
            <Line
              type="monotone"
              dataKey="newCustomers"
              stroke="var(--color-newCustomers)"
              strokeWidth={2}
              dot={false}
            />
            {!simplifySeries ? (
              <Line
                type="monotone"
                dataKey="cumulativeCustomers"
                stroke="var(--color-cumulativeCustomers)"
                strokeWidth={2}
                dot={false}
              />
            ) : null}
          </LineChart>
        </RechartsChartContainer>
      ) : null}
    </ChartContainer>
  );
}
