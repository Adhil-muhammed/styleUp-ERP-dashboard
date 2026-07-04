import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerStatus } from '@/features/user-management/types/customer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

const ALL_FILTER = 'all';

export type CustomerStatusFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CustomerStatusFilter({
  value,
  onChange,
}: CustomerStatusFilterProps): React.ReactElement {
  const { t } = useTranslation('user-management');

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full min-w-36 sm:w-40">
        <SelectValue placeholder={t('columns.status')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_FILTER}>{t('list.filterAll')}</SelectItem>
        <SelectItem value="active">{t('status.active')}</SelectItem>
        <SelectItem value="suspended">{t('status.suspended')}</SelectItem>
        <SelectItem value="pending">{t('status.pending')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function statusFilterToParam(value: string): CustomerStatus | undefined {
  if (value === ALL_FILTER) return undefined;
  return value as CustomerStatus;
}

export { ALL_FILTER as CUSTOMER_STATUS_ALL_FILTER };
