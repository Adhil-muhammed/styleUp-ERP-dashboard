import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { StaffAvailabilityBadge } from '@/features/staff-management/components/StaffAvailabilityBadge';
import { StaffStatusBadge } from '@/features/staff-management/components/StaffStatusBadge';
import { useStaffProfileQuery } from '@/features/staff-management/hooks/use-staff-management-queries';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { StarRating } from '@/shared/components/rating/StarRating';
import { ROUTES } from '@/shared/config/routes';

type StaffProfileHeaderProps = {
  staffId: string;
};

export function StaffProfileHeader({ staffId }: StaffProfileHeaderProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const { data, isPending, isError } = useStaffProfileQuery(staffId);

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.staff}>
            <ArrowLeft />
            {t('profile.backToList')}
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">{t('errors.staffNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to={ROUTES.staff}>
          <ArrowLeft />
          {t('profile.backToList')}
        </Link>
      </Button>
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to={ROUTES.staff} className="hover:text-foreground">
          {t('page.title')}
        </Link>
        {' / '}
        <span className="text-foreground">{data.name}</span>
      </nav>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.name}</h1>
        <p className="text-sm text-muted-foreground">
          {t(`role.${data.role}`)} · {data.shopName}
        </p>
        <p className="text-sm text-muted-foreground">{data.email} · {data.phone}</p>
        <div className="flex flex-wrap items-center gap-2">
          <StaffStatusBadge status={data.status} />
          <StaffAvailabilityBadge availability={data.availability} />
          <StarRating value={data.rating} size="sm" showValue />
        </div>
        {data.bio ? <p className="text-sm text-muted-foreground">{data.bio}</p> : null}
      </div>
    </div>
  );
}
