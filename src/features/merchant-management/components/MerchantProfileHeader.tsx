import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ShopStatusBadge } from '@/features/merchant-management/components/ShopStatusBadge';
import { useShopProfileQuery } from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { ROUTES } from '@/shared/config/routes';
import { StarRating } from '@/shared/components/rating/StarRating';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function MerchantProfileHeader({
  merchantId,
}: {
  merchantId: string;
}): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const { data, isPending, isError } = useShopProfileQuery(merchantId);

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-64" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.merchants}>
            <ArrowLeft />
            {t('profile.backToList')}
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">{t('errors.shopNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to={ROUTES.merchants}>
          <ArrowLeft />
          {t('profile.backToList')}
        </Link>
      </Button>
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to={ROUTES.merchants} className="hover:text-foreground">
          {t('page.title')}
        </Link>
        {' / '}
        <span className="text-foreground">{data.shopName}</span>
      </nav>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.shopName}</h1>
          {data.isFeatured ? <Badge variant="secondary">{t('list.featured')}</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {t('columns.owner')}: {data.ownerName} · {data.city}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <StarRating value={data.rating} showValue />
          <ShopStatusBadge status={data.status} />
        </div>
      </div>
    </div>
  );
}
