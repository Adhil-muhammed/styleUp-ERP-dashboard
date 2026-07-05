import {
  Calendar,
  CalendarCheck,
  CalendarX,
  IndianRupee,
  Star,
  Store,
  Tag,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { formatInr, formatNumber, formatRating } from '@/features/dashboard/lib/formatters';
import { useDashboardKpisQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import type { DashboardKpis, KpiKey } from '@/features/dashboard/types/dashboard-kpis';
import { ResponsiveGrid } from '@/shared/components/layout/ResponsiveGrid';
import { KpiCard, KpiCardSkeleton } from '@/shared/components/kpi/KpiCard';
import { useScope } from '@/shared/hooks/use-scope';

type KpiConfig = {
  key: KpiKey;
  icon: LucideIcon;
  format: (value: number) => string;
  platformOnly?: boolean;
};

const KPI_CONFIG: KpiConfig[] = [
  { key: 'totalCustomers', icon: Users, format: formatNumber, platformOnly: true },
  { key: 'activeCustomers', icon: Users, format: formatNumber, platformOnly: true },
  { key: 'totalShops', icon: Store, format: formatNumber, platformOnly: true },
  { key: 'activeShops', icon: Store, format: formatNumber, platformOnly: true },
  { key: 'todaysBookings', icon: Calendar, format: formatNumber },
  { key: 'upcomingBookings', icon: CalendarCheck, format: formatNumber },
  { key: 'cancelledBookings', icon: CalendarX, format: formatNumber },
  { key: 'revenueToday', icon: IndianRupee, format: formatInr },
  { key: 'revenueThisMonth', icon: IndianRupee, format: formatInr },
  { key: 'averageRating', icon: Star, format: formatRating },
  { key: 'activePromotions', icon: Tag, format: formatNumber, platformOnly: true },
];

function KpiCardItem({
  config,
  kpis,
}: {
  config: KpiConfig;
  kpis: DashboardKpis;
}): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const metric = kpis[config.key];

  return (
    <KpiCard
      label={t(`kpis.${config.key}`)}
      value={config.format(metric.value)}
      icon={config.icon}
      trend={metric.trend}
    />
  );
}

function KpiGridSkeleton({ count }: { count: number }): React.ReactElement {
  return (
    <ResponsiveGrid preset="kpiCards">
      {Array.from({ length: count }, (_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
    </ResponsiveGrid>
  );
}

function KpiGridContent({
  kpis,
  configs,
}: {
  kpis: DashboardKpis;
  configs: KpiConfig[];
}): React.ReactElement {
  return (
    <ResponsiveGrid preset="kpiCards">
      {configs.map((config) => (
        <KpiCardItem key={config.key} config={config} kpis={kpis} />
      ))}
    </ResponsiveGrid>
  );
}

export function KpiCardGrid(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { merchantId } = useScope();
  const isPlatformView = merchantId === null;
  const visibleConfigs = KPI_CONFIG.filter((config) => isPlatformView || !config.platformOnly);
  const { data, isPending, isError } = useDashboardKpisQuery();

  return (
    <DashboardSection
      isPending={isPending}
      isError={isError}
      isEmpty={!data}
      emptyMessage={t('empty.kpis')}
      skeleton={<KpiGridSkeleton count={visibleConfigs.length} />}
    >
      {data ? <KpiGridContent kpis={data} configs={visibleConfigs} /> : null}
    </DashboardSection>
  );
}
