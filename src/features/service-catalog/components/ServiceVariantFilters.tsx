import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCategoryListQuery } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import type { ServiceGender, ServiceVariantStatus } from '@/features/service-catalog/types/service-variant';
import { SERVICE_GENDERS } from '@/features/service-catalog/types/service-variant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const VARIANT_CATEGORY_ALL_FILTER = 'all';
export const VARIANT_GENDER_ALL_FILTER = 'all';
export const VARIANT_STATUS_ALL_FILTER = 'all';

export function variantCategoryFilterToParam(value: string): string | undefined {
  return value === VARIANT_CATEGORY_ALL_FILTER ? undefined : value;
}

export function variantGenderFilterToParam(value: string): ServiceGender | undefined {
  return value === VARIANT_GENDER_ALL_FILTER ? undefined : (value as ServiceGender);
}

export function variantStatusFilterToParam(value: string): ServiceVariantStatus | undefined {
  return value === VARIANT_STATUS_ALL_FILTER ? undefined : (value as ServiceVariantStatus);
}

type ServiceVariantFiltersProps = {
  category: string;
  gender: string;
  status: string;
  onCategoryChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function ServiceVariantFilters({
  category,
  gender,
  status,
  onCategoryChange,
  onGenderChange,
  onStatusChange,
}: ServiceVariantFiltersProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const { data: categoriesData } = useCategoryListQuery({ page: 1, pageSize: 100 });
  const categories = categoriesData?.data ?? [];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('columns.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VARIANT_CATEGORY_ALL_FILTER}>{t('list.filterAllCategories')}</SelectItem>
          {categories.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={gender} onValueChange={onGenderChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('columns.gender')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VARIANT_GENDER_ALL_FILTER}>{t('list.filterAllGender')}</SelectItem>
          {SERVICE_GENDERS.map((item) => (
            <SelectItem key={item} value={item}>
              {t(`gender.${item}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
          <SelectValue placeholder={t('columns.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VARIANT_STATUS_ALL_FILTER}>{t('list.filterAllStatus')}</SelectItem>
          <SelectItem value="active">{t('status.active')}</SelectItem>
          <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
