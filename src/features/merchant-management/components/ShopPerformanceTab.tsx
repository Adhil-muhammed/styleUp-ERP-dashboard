import { useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useShopPerformanceQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { ChartContainer } from '@/shared/components/charts/ChartContainer';
import { useChartResponsive } from '@/shared/hooks/use-chart-responsive';
import {
  ChartContainer as RechartsChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';

const bookingsConfig = { bookings: { label: 'Bookings', color: 'var(--chart-1)' } } satisfies ChartConfig;
const revenueConfig = { revenue: { label: 'Revenue', color: 'var(--chart-2)' } } satisfies ChartConfig;
const ratingConfig = { rating: { label: 'Rating', color: 'var(--chart-3)' } } satisfies ChartConfig;

function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function ShopPerformanceTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const [period, setPeriod] = useState<7 | 30>(7);
  const { chartContainerClass, skeletonClass, height } = useChartResponsive();
  const { data, isPending, isError, error } = useShopPerformanceQuery(merchantId, period);

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer
          title={t('performance.bookingsTrend')}
          isLoading={isPending}
          isError={isError}
          errorMessage={error?.message}
          isEmpty={!data?.data.length}
          emptyMessage={t('empty.performance')}
          skeletonClassName={skeletonClass}
        >
          <RechartsChartContainer config={bookingsConfig} className={chartContainerClass}>
            <ComposedChart data={data?.data ?? []} height={height}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
            </ComposedChart>
          </RechartsChartContainer>
        </ChartContainer>

        <ChartContainer
          title={t('performance.revenueTrend')}
          isLoading={isPending}
          isError={isError}
          isEmpty={!data?.data.length}
          skeletonClassName={skeletonClass}
        >
          <RechartsChartContainer config={revenueConfig} className={chartContainerClass}>
            <ComposedChart data={data?.data ?? []} height={height}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} />
              <YAxis tickFormatter={(v: number) => formatInr(v)} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" dot={false} />
            </ComposedChart>
          </RechartsChartContainer>
        </ChartContainer>

        <div className="lg:col-span-2">
          <ChartContainer
            title={t('performance.ratingTrend')}
            isLoading={isPending}
            isError={isError}
            isEmpty={!data?.data.length}
            skeletonClassName={skeletonClass}
          >
          <RechartsChartContainer config={ratingConfig} className={chartContainerClass}>
            <ComposedChart data={data?.data ?? []} height={height}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="rating" stroke="var(--color-rating)" dot={false} />
            </ComposedChart>
          </RechartsChartContainer>
        </ChartContainer>
        </div>
      </div>
    </div>
  );
}
