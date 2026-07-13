import { subDays, startOfMonth, startOfToday } from 'date-fns';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import type { PaymentMethod, TransactionStatus } from '@/features/payments/types/payment';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { table } from '@/theme/responsive';

export const PAYMENT_STATUS_ALL_FILTER = 'all';
export const PAYMENT_METHOD_ALL_FILTER = 'all';
export const PAYMENT_SHOP_ALL_FILTER = 'all';
export const PAYMENT_DATE_PRESET_ALL = 'all';
export const PAYMENT_DATE_PRESET_TODAY = 'today';
export const PAYMENT_DATE_PRESET_7D = '7d';
export const PAYMENT_DATE_PRESET_30D = '30d';
export const PAYMENT_DATE_PRESET_CUSTOM = 'custom';

const filterControlClass = 'w-full min-w-0';

export function statusFilterToParam(value: string): TransactionStatus | undefined {
  return value === PAYMENT_STATUS_ALL_FILTER ? undefined : (value as TransactionStatus);
}

export function methodFilterToParam(value: string): PaymentMethod | undefined {
  return value === PAYMENT_METHOD_ALL_FILTER ? undefined : (value as PaymentMethod);
}

export function shopFilterToParam(value: string): string | undefined {
  return value === PAYMENT_SHOP_ALL_FILTER ? undefined : value;
}

export function datePresetToRange(
  preset: string,
  customFrom: string,
  customTo: string,
): { dateFrom?: string; dateTo?: string } {
  const today = startOfToday();

  switch (preset) {
    case PAYMENT_DATE_PRESET_TODAY:
      return {
        dateFrom: today.toISOString().slice(0, 10),
        dateTo: today.toISOString().slice(0, 10),
      };
    case PAYMENT_DATE_PRESET_7D:
      return {
        dateFrom: subDays(today, 7).toISOString().slice(0, 10),
        dateTo: today.toISOString().slice(0, 10),
      };
    case PAYMENT_DATE_PRESET_30D:
      return {
        dateFrom: subDays(today, 30).toISOString().slice(0, 10),
        dateTo: today.toISOString().slice(0, 10),
      };
    case PAYMENT_DATE_PRESET_CUSTOM:
      return {
        dateFrom: customFrom || undefined,
        dateTo: customTo || undefined,
      };
    default:
      return {};
  }
}

type PaymentFiltersProps = {
  status: string;
  method: string;
  shop: string;
  datePreset: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  onStatusChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onShopChange: (value: string) => void;
  onDatePresetChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
};

export function PaymentFilters({
  status,
  method,
  shop,
  datePreset,
  dateFrom,
  dateTo,
  amountMin,
  amountMax,
  onStatusChange,
  onMethodChange,
  onShopChange,
  onDatePresetChange,
  onDateFromChange,
  onDateToChange,
  onAmountMinChange,
  onAmountMaxChange,
}: PaymentFiltersProps): React.ReactElement {
  const { t } = useTranslation('payments');
  const [shopSearch, setShopSearch] = useState('');

  const shopOptions = useMemo(() => {
    const query = shopSearch.trim().toLowerCase();
    if (!query) {
      return shopsFixture;
    }
    return shopsFixture.filter((item) => item.shopName.toLowerCase().includes(query));
  }, [shopSearch]);

  return (
    <div className={table.filterGrid}>
      <Select value={datePreset} onValueChange={onDatePresetChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('filters.datePreset')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PAYMENT_DATE_PRESET_ALL}>{t('filters.allDates')}</SelectItem>
          <SelectItem value={PAYMENT_DATE_PRESET_TODAY}>{t('filters.today')}</SelectItem>
          <SelectItem value={PAYMENT_DATE_PRESET_7D}>{t('filters.last7d')}</SelectItem>
          <SelectItem value={PAYMENT_DATE_PRESET_30D}>{t('filters.last30d')}</SelectItem>
          <SelectItem value={PAYMENT_DATE_PRESET_CUSTOM}>{t('filters.custom')}</SelectItem>
        </SelectContent>
      </Select>

      {datePreset === PAYMENT_DATE_PRESET_CUSTOM ? (
        <>
          <Input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={filterControlClass}
            aria-label={t('filters.dateFrom')}
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={filterControlClass}
            aria-label={t('filters.dateTo')}
          />
        </>
      ) : null}

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('filters.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PAYMENT_STATUS_ALL_FILTER}>{t('filters.allStatus')}</SelectItem>
          <SelectItem value="pending">{t('status.pending')}</SelectItem>
          <SelectItem value="success">{t('status.success')}</SelectItem>
          <SelectItem value="failed">{t('status.failed')}</SelectItem>
          <SelectItem value="refunded">{t('status.refunded')}</SelectItem>
          <SelectItem value="partially_refunded">{t('status.partially_refunded')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={method} onValueChange={onMethodChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('filters.method')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PAYMENT_METHOD_ALL_FILTER}>{t('filters.allMethods')}</SelectItem>
          <SelectItem value="upi">{t('method.upi')}</SelectItem>
          <SelectItem value="card">{t('method.card')}</SelectItem>
          <SelectItem value="netbanking">{t('method.netbanking')}</SelectItem>
          <SelectItem value="wallet">{t('method.wallet')}</SelectItem>
        </SelectContent>
      </Select>

      <Input
        value={shopSearch}
        onChange={(event) => setShopSearch(event.target.value)}
        placeholder={t('filters.shopSearch')}
        className={filterControlClass}
      />

      <Select value={shop} onValueChange={onShopChange}>
        <SelectTrigger size="sm" className={filterControlClass}>
          <SelectValue placeholder={t('filters.shop')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PAYMENT_SHOP_ALL_FILTER}>{t('filters.allShops')}</SelectItem>
          {shopOptions.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.shopName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        min={0}
        value={amountMin}
        onChange={(event) => onAmountMinChange(event.target.value)}
        placeholder={t('filters.amountMin')}
        className={filterControlClass}
      />

      <Input
        type="number"
        min={0}
        value={amountMax}
        onChange={(event) => onAmountMaxChange(event.target.value)}
        placeholder={t('filters.amountMax')}
        className={filterControlClass}
      />
    </div>
  );
}

export function getDefaultMonthRange(): { periodStart: string; periodEnd: string } {
  const start = startOfMonth(new Date());
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
}
