import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

type ShopStaffSelectorProps = {
  shopId: string;
  onShopChange: (shopId: string) => void;
  staffId?: string;
  onStaffChange?: (staffId: string) => void;
  showStaff?: boolean;
  showAllShops?: boolean;
};

export function ShopStaffSelector({
  shopId,
  onShopChange,
  staffId,
  onStaffChange,
  showStaff = false,
  showAllShops = false,
}: ShopStaffSelectorProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const staffOptions = staffFixture.filter((item) => item.merchantId === shopId);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Select value={shopId} onValueChange={onShopChange}>
        <SelectTrigger size="sm" className="w-full min-w-40 sm:w-48">
          <SelectValue placeholder={t('filters.shop')} />
        </SelectTrigger>
        <SelectContent>
          {showAllShops ? (
            <SelectItem value="all">{t('filters.allShops')}</SelectItem>
          ) : null}
          {shopsFixture.map((shop) => (
            <SelectItem key={shop.id} value={shop.id}>
              {shop.shopName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showStaff && onStaffChange ? (
        <Select value={staffId ?? 'all'} onValueChange={onStaffChange}>
          <SelectTrigger size="sm" className="w-full min-w-40 sm:w-48">
            <SelectValue placeholder={t('filters.staff')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allStaff')}</SelectItem>
            {staffOptions.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
