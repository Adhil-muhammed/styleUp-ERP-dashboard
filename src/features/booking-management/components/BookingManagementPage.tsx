import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useBookingsQuery } from '@/features/booking-management/hooks/use-booking-management-queries';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useScope } from '@/shared/hooks/use-scope';
import { layout, typography } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export function BookingManagementPage(): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { merchantId, isAdmin } = useScope();
  const { data, isPending, isError } = useBookingsQuery();

  const scopeLabel =
    merchantId === null
      ? t('scope.allShops')
      : t('scope.singleShop', { shopId: merchantId });

  return (
    <div className={layout.pageStack} data-testid="booking-management-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? t('page.subtitleAdmin', { scope: scopeLabel }) : t('page.subtitleOwner')}
        </p>
      </header>

      <QuerySection
        isPending={isPending}
        isError={isError}
        skeleton={<Skeleton className="h-48 w-full" />}
        isEmpty={!data?.length}
        emptyMessage={t('empty.list')}
      >
        {data ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('list.title', { count: data.length })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.serviceName} · {booking.staffName}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.shopName}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{booking.status}</Badge>
                    <Badge variant="secondary">{booking.paymentStatus}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </QuerySection>
    </div>
  );
}
