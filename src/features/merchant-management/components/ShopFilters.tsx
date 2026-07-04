import type React from 'react';
import { useTranslation } from 'react-i18next';

import { SHOP_CITIES } from '@/features/merchant-management/api/fixtures/shops.fixture';
import type { ShopStatus } from '@/features/merchant-management/types/shop';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const SHOP_STATUS_ALL_FILTER = 'all';
export const SHOP_CITY_ALL_FILTER = 'all';

export function ShopStatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.status')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SHOP_STATUS_ALL_FILTER}>{t('list.filterAllStatus')}</SelectItem>
        <SelectItem value="pending">{t('status.pending')}</SelectItem>
        <SelectItem value="approved">{t('status.approved')}</SelectItem>
        <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
        <SelectItem value="suspended">{t('status.suspended')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ShopCityFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.city')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SHOP_CITY_ALL_FILTER}>{t('list.filterAllCities')}</SelectItem>
        {SHOP_CITIES.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function statusFilterToParam(value: string): ShopStatus | undefined {
  if (value === SHOP_STATUS_ALL_FILTER) return undefined;
  return value as ShopStatus;
}

export function cityFilterToParam(value: string): string | undefined {
  if (value === SHOP_CITY_ALL_FILTER) return undefined;
  return value;
}
