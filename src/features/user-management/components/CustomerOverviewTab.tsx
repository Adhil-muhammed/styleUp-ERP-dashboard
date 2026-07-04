import { format } from 'date-fns';
import { Award, Calendar, IndianRupee, Star, Trophy } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomerAvatar } from '@/features/user-management/components/CustomerAvatar';
import { CustomerStatusBadge } from '@/features/user-management/components/CustomerStatusBadge';
import { useCustomerProfileQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { formatInr } from '@/features/dashboard/lib/formatters';
import { KpiCard } from '@/shared/components/kpi/KpiCard';
import { ResponsiveGrid } from '@/shared/components/layout/ResponsiveGrid';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

type CustomerOverviewTabProps = {
  customerId: string;
};

function OverviewSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function CustomerOverviewTab({ customerId }: CustomerOverviewTabProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const { data, isPending, isError } = useCustomerProfileQuery(customerId);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<OverviewSkeleton />}
    >
      {data ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('overview.profileDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <CustomerAvatar name={data.name} avatarUrl={data.avatarUrl} size="lg" />
                <div className="min-w-0 space-y-2">
                  <p className="text-lg font-semibold">{data.name}</p>
                  <p className="text-sm text-muted-foreground">{data.email}</p>
                  <p className="text-sm text-muted-foreground">{data.phone}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <CustomerStatusBadge status={data.status} />
                    <span className="text-sm text-muted-foreground">
                      {t('overview.joinDate')}: {format(new Date(data.joinDate), 'dd MMM yyyy')}
                    </span>
                    {data.lastLoginAt ? (
                      <span className="text-sm text-muted-foreground">
                        {t('overview.lastLogin')}:{' '}
                        {format(new Date(data.lastLoginAt), 'dd MMM yyyy, HH:mm')}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('list.neverLoggedIn')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ResponsiveGrid preset="kpiCards">
            <KpiCard
              label={t('overview.stats.xp')}
              value={data.xp.toLocaleString()}
              icon={Trophy}
            />
            <KpiCard label={t('overview.stats.level')} value={String(data.level)} icon={Award} />
            <KpiCard
              label={t('overview.stats.bookings')}
              value={String(data.totalBookings)}
              icon={Calendar}
            />
            <KpiCard
              label={t('overview.stats.spent')}
              value={formatInr(data.totalSpent)}
              icon={IndianRupee}
            />
            <KpiCard
              label={t('overview.stats.reviews')}
              value={String(data.reviewCount)}
              icon={Star}
            />
          </ResponsiveGrid>
        </div>
      ) : null}
    </QuerySection>
  );
}
