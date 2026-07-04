import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CustomerAvatar } from '@/features/user-management/components/CustomerAvatar';
import { CustomerStatusBadge } from '@/features/user-management/components/CustomerStatusBadge';
import { useCustomerProfileQuery } from '@/features/user-management/hooks/use-user-management-queries';
import { ROUTES } from '@/shared/config/routes';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

type CustomerProfileHeaderProps = {
  customerId: string;
};

export function CustomerProfileHeader({
  customerId,
}: CustomerProfileHeaderProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const { data, isPending, isError } = useCustomerProfileQuery(customerId);

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.users}>
            <ArrowLeft />
            {t('profile.backToList')}
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">{t('errors.customerNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to={ROUTES.users}>
          <ArrowLeft />
          {t('profile.backToList')}
        </Link>
      </Button>
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to={ROUTES.users} className="hover:text-foreground">
          {t('page.title')}
        </Link>
        {' / '}
        <span className="text-foreground">{data.name}</span>
      </nav>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CustomerAvatar name={data.name} avatarUrl={data.avatarUrl} size="lg" />
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.name}</h1>
          <p className="text-sm text-muted-foreground">{data.email}</p>
          <CustomerStatusBadge status={data.status} />
        </div>
      </div>
    </div>
  );
}
