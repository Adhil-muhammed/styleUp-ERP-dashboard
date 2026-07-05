import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import type { BookingStatus, PaymentStatus } from '@/features/booking-management/types/booking';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { table } from '@/theme/responsive';

export const BOOKING_STATUS_ALL_FILTER = 'all';
export const BOOKING_UPCOMING_FILTER = 'upcoming';
export const BOOKING_SHOP_ALL_FILTER = 'all';
export const BOOKING_STAFF_ALL_FILTER = 'all';
export const BOOKING_PAYMENT_ALL_FILTER = 'all';

const filterControlClass = 'w-full min-w-0';

export function statusFilterToParam(value: string): {
  status?: BookingStatus;
  upcoming?: boolean;
} {
  if (value === BOOKING_STATUS_ALL_FILTER) {
    return {};
  }
  if (value === BOOKING_UPCOMING_FILTER) {
    return { upcoming: true };
  }
  return { status: value as BookingStatus };
}

export function shopFilterToParam(value: string): string | undefined {
  return value === BOOKING_SHOP_ALL_FILTER ? undefined : value;
}

export function staffFilterToParam(value: string): string | undefined {
  return value === BOOKING_STAFF_ALL_FILTER ? undefined : value;
}

export function paymentFilterToParam(value: string): PaymentStatus | undefined {
  return value === BOOKING_PAYMENT_ALL_FILTER ? undefined : (value as PaymentStatus);
}

type BookingFiltersProps = {
  status: string;
  shop: string;
  staff: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  customerSearch: string;
  onStatusChange: (value: string) => void;
  onShopChange: (value: string) => void;
  onStaffChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onCustomerSearchChange: (value: string) => void;
};

export function BookingFilters({
  status,
  shop,
  staff,
  paymentStatus,
  dateFrom,
  dateTo,
  customerSearch,
  onStatusChange,
  onShopChange,
  onStaffChange,
  onPaymentStatusChange,
  onDateFromChange,
  onDateToChange,
  onCustomerSearchChange,
}: BookingFiltersProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  const staffOptions =
    shop === BOOKING_SHOP_ALL_FILTER
      ? staffFixture
      : staffFixture.filter((item) => item.merchantId === shop);

  return (
    <div className={table.filterGrid}>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('list.filterStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BOOKING_STATUS_ALL_FILTER}>{t('list.filterAllStatus')}</SelectItem>
          <SelectItem value="pending">{t('status.pending')}</SelectItem>
          <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
          <SelectItem value={BOOKING_UPCOMING_FILTER}>{t('status.upcoming')}</SelectItem>
          <SelectItem value="completed">{t('status.completed')}</SelectItem>
          <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
          <SelectItem value="no_show">{t('status.no_show')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={shop} onValueChange={onShopChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('list.filterShop')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BOOKING_SHOP_ALL_FILTER}>{t('list.filterAllShops')}</SelectItem>
          {shopsFixture.map((shopItem) => (
            <SelectItem key={shopItem.id} value={shopItem.id}>
              {shopItem.shopName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={staff} onValueChange={onStaffChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('list.filterStaff')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BOOKING_STAFF_ALL_FILTER}>{t('list.filterAllStaff')}</SelectItem>
          {staffOptions.map((staffItem) => (
            <SelectItem key={staffItem.id} value={staffItem.id}>
              {staffItem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={dateFrom}
        onChange={(event) => onDateFromChange(event.target.value)}
        className={filterControlClass}
        aria-label={t('list.filterDateFrom')}
      />

      <Input
        type="date"
        value={dateTo}
        onChange={(event) => onDateToChange(event.target.value)}
        className={filterControlClass}
        aria-label={t('list.filterDateTo')}
      />

      <Input
        type="search"
        value={customerSearch}
        onChange={(event) => onCustomerSearchChange(event.target.value)}
        placeholder={t('list.filterCustomerPlaceholder')}
        className={filterControlClass}
      />

      <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('list.filterPayment')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BOOKING_PAYMENT_ALL_FILTER}>{t('list.filterAllPayment')}</SelectItem>
          <SelectItem value="paid">{t('paymentStatus.paid')}</SelectItem>
          <SelectItem value="pending">{t('paymentStatus.pending')}</SelectItem>
          <SelectItem value="partially_paid">{t('paymentStatus.partially_paid')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
