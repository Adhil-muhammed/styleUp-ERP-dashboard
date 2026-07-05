import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CategoryStatus } from '@/features/service-catalog/types/category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const CATEGORY_STATUS_ALL_FILTER = 'all';

export function categoryStatusFilterToParam(value: string): CategoryStatus | undefined {
  return value === CATEGORY_STATUS_ALL_FILTER ? undefined : (value as CategoryStatus);
}

type CategoryFiltersProps = {
  status: string;
  onStatusChange: (value: string) => void;
};

export function CategoryFilters({
  status,
  onStatusChange,
}: CategoryFiltersProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');

  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.status')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CATEGORY_STATUS_ALL_FILTER}>{t('list.filterAllStatus')}</SelectItem>
        <SelectItem value="active">{t('status.active')}</SelectItem>
        <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
