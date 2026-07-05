import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { HolidaySchema, type HolidayFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { Holiday } from '@/features/calendar-scheduling/types/holiday';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Sheet } from '@/shared/components/ui/sheet';
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

type HolidayFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  holiday?: Holiday;
  onSaved?: (holiday: Holiday) => void;
};

export function HolidayFormSheet({
  open,
  onOpenChange,
  shopId,
  holiday,
  onSaved,
}: HolidayFormSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const createMutation = useCreateHolidayMutation();
  const updateMutation = useUpdateHolidayMutation(holiday?.id ?? '');

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
    values: holiday
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
  });

  const onSubmit = form.handleSubmit((values) => {
    const handler = holiday
      ? updateMutation.mutateAsync(values)
      : createMutation.mutateAsync(values);
    void handler.then((saved) => {
      onSaved?.(saved);
      onOpenChange(false);
    });
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={holiday ? t('holidays.editTitle') : t('holidays.addTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="holiday-form" disabled={isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <form id="holiday-form" onSubmit={onSubmit} className={cn(formSheet.form)}>
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
      </FormSheetContent>
    </Sheet>
  );
}
