import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateRecurringPatternMutation,
  useUpdateRecurringPatternMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { RecurringPatternSchema, type RecurringPatternFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { RecurringPattern } from '@/features/calendar-scheduling/types/recurring-availability';
import { DAYS_OF_WEEK } from '@/features/merchant-management/types/working-hours';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Sheet } from '@/shared/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formSheet } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

type RecurringPatternEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  pattern?: RecurringPattern;
};

export function RecurringPatternEditor({
  open,
  onOpenChange,
  shopId,
  pattern,
}: RecurringPatternEditorProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const createMutation = useCreateRecurringPatternMutation();
  const updateMutation = useUpdateRecurringPatternMutation(pattern?.id ?? '');
  const staffOptions = useMemo(
    () => staffFixture.filter((s) => s.merchantId === shopId),
    [shopId],
  );

  const editValues = useMemo(
    () =>
      pattern
        ? {
            shopId: pattern.shopId,
            staffId: pattern.staffId,
            label: pattern.label,
            effectiveFrom: pattern.effectiveFrom.slice(0, 10),
            effectiveTo: pattern.effectiveTo?.slice(0, 10),
            schedule: pattern.schedule,
          }
        : undefined,
    [
      pattern?.id,
      pattern?.shopId,
      pattern?.staffId,
      pattern?.label,
      pattern?.effectiveFrom,
      pattern?.effectiveTo,
      pattern?.schedule,
    ],
  );

  const form = useForm<RecurringPatternFormInput>({
    resolver: zodResolver(RecurringPatternSchema),
    defaultValues: {
      shopId,
      staffId: staffOptions[0]?.id ?? '',
      label: '',
      effectiveFrom: new Date().toISOString().slice(0, 10),
      schedule: [{ day: 'mon', ranges: [{ openTime: '09:00', closeTime: '18:00' }] }],
    },
    values: editValues,
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'schedule' });

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      effectiveFrom: `${values.effectiveFrom}T00:00:00.000Z`,
      effectiveTo: values.effectiveTo ? `${values.effectiveTo}T23:59:59.999Z` : undefined,
    };
    const handler = pattern
      ? updateMutation.mutateAsync(payload)
      : createMutation.mutateAsync(payload);
    void handler.then(() => onOpenChange(false));
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={pattern ? t('recurring.editTitle') : t('recurring.addTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="recurring-form" disabled={createMutation.isPending || updateMutation.isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <form id="recurring-form" onSubmit={onSubmit} className={cn(formSheet.form)}>
          <Input placeholder={t('recurring.label')} {...form.register('label')} />
          <Select value={form.watch('staffId')} onValueChange={(v) => form.setValue('staffId', v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {staffOptions.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" {...form.register('effectiveFrom')} />
          <Input type="date" {...form.register('effectiveTo')} />
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2 rounded-lg border p-3">
              <Select
                value={form.watch(`schedule.${index}.day`)}
                onValueChange={(v) =>
                  form.setValue(`schedule.${index}.day`, v as RecurringPatternFormInput['schedule'][number]['day'])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {t(`workingHours.days.${day}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input type="time" {...form.register(`schedule.${index}.ranges.0.openTime`)} />
                <Input type="time" {...form.register(`schedule.${index}.ranges.0.closeTime`)} />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => remove(index)}>
                {t('recurring.removeDay')}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ day: 'mon', ranges: [{ openTime: '09:00', closeTime: '18:00' }] })}
          >
            {t('recurring.addDay')}
          </Button>
        </form>
      </FormSheetContent>
    </Sheet>
  );
}
