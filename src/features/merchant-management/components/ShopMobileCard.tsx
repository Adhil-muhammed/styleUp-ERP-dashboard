import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ShopStatusBadge } from '@/features/merchant-management/components/ShopStatusBadge';
import type { ShopListItem } from '@/features/merchant-management/types/shop';
import { StarRating } from '@/shared/components/rating/StarRating';
import { Badge } from '@/shared/components/ui/badge';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type ShopMobileCardProps = {
  shop: ShopListItem;
  actions?: React.ReactNode;
};

export function ShopMobileCard({ shop, actions }: ShopMobileCardProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="shop-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <TruncatedText text={shop.shopName} className="font-medium" />
            {shop.isFeatured ? (
              <Badge variant="secondary">{t('list.featured')}</Badge>
            ) : null}
          </div>
          <TruncatedText text={shop.ownerName} className="text-sm text-muted-foreground" />
          <StarRating value={shop.rating} size="sm" showValue />
        </div>
        {actions}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">{t('columns.city')}: </span>
          {shop.city}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.activeServices')}: </span>
          {shop.activeServices}
        </div>
        <div>
          <span className="text-muted-foreground">{t('columns.activeStaff')}: </span>
          {shop.activeStaff}
        </div>
      </div>
      <div className="mt-2">
        <ShopStatusBadge status={shop.status} />
      </div>
    </div>
  );
}
