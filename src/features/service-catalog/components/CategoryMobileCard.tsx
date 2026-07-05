import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryStatusBadge } from '@/features/service-catalog/components/CategoryStatusBadge';
import type { ServiceCategoryListItem } from '@/features/service-catalog/types/category';
import { TruncatedText } from '@/shared/components/text/TruncatedText';

export type CategoryMobileCardProps = {
  category: ServiceCategoryListItem;
  actions?: React.ReactNode;
};

export function CategoryMobileCard({
  category,
  actions,
}: CategoryMobileCardProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');

  return (
    <div className="rounded-lg border bg-card p-3" data-testid="category-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt=""
              className="size-10 shrink-0 rounded-md object-cover"
            />
          ) : null}
          <div className="min-w-0 space-y-1">
            <TruncatedText text={category.name} className="font-medium" />
            <p className="text-sm text-muted-foreground">
              {t('columns.variantCount')}: {category.variantCount}
            </p>
          </div>
        </div>
        {actions}
      </div>
      <div className="mt-2">
        <CategoryStatusBadge status={category.status} />
      </div>
    </div>
  );
}
