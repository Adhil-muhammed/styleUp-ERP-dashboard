import { Cell, Pie, PieChart } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useBookingStatusChartQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import type { BookingStatus } from '@/features/dashboard/types/dashboard-charts';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { getChartColor } from '@/shared/components/charts/chart-theme';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';

const STATUS_KEYS: BookingStatus[] = ['confirmed', 'completed', 'cancelled', 'no_show'];

export function BookingStatusChart(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { isCompact, isMobile, mobileConfig, chartContainerClass, skeletonClass, height } =
    useChartResponsive();
  const { data, isPending, isError, error } = useBookingStatusChartQuery();

  const hideLegend = isMobile && mobileConfig.hideLegend;

  const chartConfig = STATUS_KEYS.reduce<ChartConfig>((config, status, index) => {
    config[status] = {
      label: t(`charts.bookingStatus.${status}`),
      color: getChartColor(index),
    };
    return config;
  }, {});

  const chartData = data?.data.map((item) => ({
    ...item,
    fill: `var(--color-${item.status})`,
  }));

  return (
    <ChartContainer
      title={t('charts.bookingStatus.title')}
      description={t('charts.bookingStatus.description')}
      isLoading={isPending}
      isError={isError}
      errorMessage={error?.message}
      isEmpty={!chartData?.length}
      emptyMessage={t('empty.chart')}
      skeletonClassName={skeletonClass}
    >
      {chartData ? (
        <RechartsChartContainer
          config={chartConfig}
          className={chartContainerClass}
          initialDimension={{ width: 320, height }}
        >
          <PieChart>
            <ChartTooltip
              wrapperStyle={{ zIndex: 50 }}
              content={<ChartTooltipContent hideLabel />}
            />
            {!hideLegend ? (
              <ChartLegend
                content={<ChartLegendContent nameKey="status" className="flex-wrap gap-2" />}
              />
            ) : null}
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={isCompact ? 36 : 60}
              outerRadius={isCompact ? 56 : 96}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </RechartsChartContainer>
      ) : null}
    </ChartContainer>
  );
}
