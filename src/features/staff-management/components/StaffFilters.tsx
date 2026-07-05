import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import type { StaffAvailability, StaffRole, StaffStatus } from '@/features/staff-management/types/staff';
import { STAFF_ROLES } from '@/features/staff-management/types/staff';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const STAFF_SHOP_ALL_FILTER = 'all';
export const STAFF_ROLE_ALL_FILTER = 'all';
export const STAFF_STATUS_ALL_FILTER = 'all';
export const STAFF_AVAILABILITY_ALL_FILTER = 'all';

const FILTER_SHOPS = shopsFixture.slice(0, 4);

export function shopFilterToParam(value: string): string | undefined {
  return value === STAFF_SHOP_ALL_FILTER ? undefined : value;
}

export function roleFilterToParam(value: string): StaffRole | undefined {
  return value === STAFF_ROLE_ALL_FILTER ? undefined : (value as StaffRole);
}

export function statusFilterToParam(value: string): StaffStatus | undefined {
  return value === STAFF_STATUS_ALL_FILTER ? undefined : (value as StaffStatus);
}

export function availabilityFilterToParam(value: string): StaffAvailability | undefined {
  return value === STAFF_AVAILABILITY_ALL_FILTER ? undefined : (value as StaffAvailability);
}

type FilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StaffShopFilter({ value, onChange }: FilterProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.shop')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={STAFF_SHOP_ALL_FILTER}>{t('list.filterAllShops')}</SelectItem>
        {FILTER_SHOPS.map((shop) => (
          <SelectItem key={shop.id} value={shop.id}>
            {shop.shopName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StaffRoleFilter({ value, onChange }: FilterProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.role')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={STAFF_ROLE_ALL_FILTER}>{t('list.filterAllRoles')}</SelectItem>
        {STAFF_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {t(`role.${role}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StaffStatusFilter({ value, onChange }: FilterProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.status')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={STAFF_STATUS_ALL_FILTER}>{t('list.filterAllStatus')}</SelectItem>
        <SelectItem value="active">{t('status.active')}</SelectItem>
        <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function StaffAvailabilityFilter({ value, onChange }: FilterProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.availability')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={STAFF_AVAILABILITY_ALL_FILTER}>{t('list.filterAllAvailability')}</SelectItem>
        <SelectItem value="available">{t('availability.available')}</SelectItem>
        <SelectItem value="busy">{t('availability.busy')}</SelectItem>
        <SelectItem value="off">{t('availability.off')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function StaffFilters({
  shop,
  role,
  status,
  availability,
  onShopChange,
  onRoleChange,
  onStatusChange,
  onAvailabilityChange,
  showShopFilter = true,
}: {
  shop: string;
  role: string;
  status: string;
  availability: string;
  onShopChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  showShopFilter?: boolean;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {showShopFilter ? <StaffShopFilter value={shop} onChange={onShopChange} /> : null}
      <StaffRoleFilter value={role} onChange={onRoleChange} />
      <StaffStatusFilter value={status} onChange={onStatusChange} />
      <StaffAvailabilityFilter value={availability} onChange={onAvailabilityChange} />
    </div>
  );
}
