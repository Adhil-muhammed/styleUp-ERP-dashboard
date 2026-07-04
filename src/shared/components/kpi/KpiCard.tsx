import type { LucideIcon } from 'lucide-react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type React from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { typography } from '@/theme/responsive';

export type KpiTrend = {
  value: number;
  direction: 'up' | 'down' | 'neutral';
};

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: KpiTrend;
  isLoading?: boolean;
  className?: string;
}

function TrendIcon({ direction }: { direction: KpiTrend['direction'] }): React.ReactElement {
  if (direction === 'up') {
    return <TrendingUp className="size-3" aria-hidden />;
  }
  if (direction === 'down') {
    return <TrendingDown className="size-3" aria-hidden />;
  }
  return <Minus className="size-3" aria-hidden />;
}

function trendVariant(
  direction: KpiTrend['direction'],
): 'default' | 'secondary' | 'destructive' {
  if (direction === 'up') {
    return 'default';
  }
  if (direction === 'down') {
    return 'destructive';
  }
  return 'secondary';
}

export function KpiCardSkeleton({ className }: { className?: string }): React.ReactElement {
  return (
    <Card className={cn('h-full w-full', className)} data-testid="kpi-card-skeleton">
      <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
        <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
        <Skeleton className="size-7 rounded-md sm:size-8" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-16 sm:h-8 sm:w-20" />
        <Skeleton className="h-3 w-14 sm:h-4 sm:w-16" />
      </CardContent>
    </Card>
  );
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  isLoading = false,
  className,
}: KpiCardProps): React.ReactElement {
  if (isLoading) {
    return <KpiCardSkeleton className={className} />;
  }

  return (
    <Card className={cn('h-full w-full', className)} data-testid="kpi-card">
      <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
        <CardTitle className={cn(typography.kpiLabel, 'font-medium')}>{label}</CardTitle>
        {Icon ? (
          <div className="rounded-md bg-muted p-1.5 sm:p-2">
            <Icon className="size-3.5 text-muted-foreground sm:size-4" aria-hidden />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">
        <p className={cn(typography.kpiValue, 'tabular-nums')}>{value}</p>
        {trend ? (
          <Badge variant={trendVariant(trend.direction)} className="shrink-0 gap-1">
            <TrendIcon direction={trend.direction} />
            {trend.value}%
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
