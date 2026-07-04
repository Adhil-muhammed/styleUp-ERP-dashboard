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

type KpiConfig = {
  key: KpiKey;
  icon: LucideIcon;
  format: (value: number) => string;
};

const KPI_CONFIG: KpiConfig[] = [
  { key: 'totalCustomers', icon: Users, format: formatNumber },
  { key: 'activeCustomers', icon: Users, format: formatNumber },
  { key: 'totalShops', icon: Store, format: formatNumber },
  { key: 'activeShops', icon: Store, format: formatNumber },
  { key: 'todaysBookings', icon: Calendar, format: formatNumber },
  { key: 'upcomingBookings', icon: CalendarCheck, format: formatNumber },
  { key: 'cancelledBookings', icon: CalendarX, format: formatNumber },
  { key: 'revenueToday', icon: IndianRupee, format: formatInr },
  { key: 'revenueThisMonth', icon: IndianRupee, format: formatInr },
  { key: 'averageRating', icon: Star, format: formatRating },
  { key: 'activePromotions', icon: Tag, format: formatNumber },
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

function KpiGridSkeleton(): React.ReactElement {
  return (
    <ResponsiveGrid preset="kpiCards">
      {KPI_CONFIG.map(({ key }) => (
        <KpiCardSkeleton key={key} />
      ))}
    </ResponsiveGrid>
  );
}

function KpiGridContent({ kpis }: { kpis: DashboardKpis }): React.ReactElement {
  return (
    <ResponsiveGrid preset="kpiCards">
      {KPI_CONFIG.map((config) => (
        <KpiCardItem key={config.key} config={config} kpis={kpis} />
      ))}
    </ResponsiveGrid>
  );
}

export function KpiCardGrid(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { data, isPending, isError } = useDashboardKpisQuery();

  return (
    <DashboardSection
      isPending={isPending}
      isError={isError}
      isEmpty={!data}
      emptyMessage={t('empty.kpis')}
      skeleton={<KpiGridSkeleton />}
    >
      {data ? <KpiGridContent kpis={data} /> : null}
    </DashboardSection>
  );
}
