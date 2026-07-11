import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { HolidaySchema, type HolidayFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { Holiday } from '@/features/calendar-scheduling/types/holiday';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formSheet } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export type HolidayFormFieldsProps = {
  formId: string;
  shopId: string;
  holiday?: Holiday;
  defaultStartDate?: string;
  defaultEndDate?: string;
  active?: boolean;
  onSuccess: () => void;
  onSaved?: (holiday: Holiday) => void;
  onPendingChange?: (pending: boolean) => void;
};

export function HolidayFormFields({
  formId,
  shopId,
  holiday,
  defaultStartDate,
  defaultEndDate,
  active = true,
  onSuccess,
  onSaved,
  onPendingChange,
}: HolidayFormFieldsProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const createMutation = useCreateHolidayMutation();
  const updateMutation = useUpdateHolidayMutation(holiday?.id ?? '');

  const editValues = useMemo(
    () =>
      holiday
        ? {
            scope: holiday.scope,
            shopId: holiday.shopId,
            staffId: holiday.staffId,
            name: holiday.name,
            startDate: holiday.startDate,
            endDate: holiday.endDate,
            recurringYearly: holiday.recurringYearly,
          }
        : undefined,
    [
      holiday?.id,
      holiday?.scope,
      holiday?.shopId,
      holiday?.staffId,
      holiday?.name,
      holiday?.startDate,
      holiday?.endDate,
      holiday?.recurringYearly,
    ],
  );

  const form = useForm<HolidayFormInput>({
    resolver: zodResolver(HolidaySchema),
    defaultValues: {
      scope: 'shop',
      shopId,
      name: '',
      startDate: '',
      endDate: '',
      recurringYearly: false,
    },
    values: editValues,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    if (!active || holiday) return;
    form.reset({
      scope: 'shop',
      shopId,
      name: '',
      startDate: defaultStartDate ?? '',
      endDate: defaultEndDate ?? defaultStartDate ?? '',
      recurringYearly: false,
    });
  }, [active, holiday, shopId, defaultStartDate, defaultEndDate, form]);

  const onSubmit = form.handleSubmit((values) => {
    const handler = holiday
      ? updateMutation.mutateAsync(values)
      : createMutation.mutateAsync(values);
    void handler.then((saved) => {
      onSaved?.(saved);
      onSuccess();
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className={cn(formSheet.form)}>
      <Input placeholder={t('holidays.name')} {...form.register('name')} />
      <Select
        value={form.watch('scope')}
        onValueChange={(v) => form.setValue('scope', v as HolidayFormInput['scope'])}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="shop">{t('holidays.scopeShop')}</SelectItem>
          <SelectItem value="staff">{t('holidays.scopeStaff')}</SelectItem>
        </SelectContent>
      </Select>
      <Input type="date" {...form.register('startDate')} />
      <Input type="date" {...form.register('endDate')} />
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={form.watch('recurringYearly')}
          onCheckedChange={(checked) => form.setValue('recurringYearly', checked)}
        />
        {t('holidays.recurringYearly')}
      </label>
    </form>
  );
}
