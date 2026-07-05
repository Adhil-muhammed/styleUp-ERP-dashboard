import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateBookingMutation } from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { ManualBookingSchema, type ManualBookingFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
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

type ManualBookingSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  defaultStart?: string;
  defaultStaffId?: string;
};

function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ManualBookingSheet({
  open,
  onOpenChange,
  shopId,
  defaultStart,
  defaultStaffId,
}: ManualBookingSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const mutation = useCreateBookingMutation();
  const staffOptions = staffFixture.filter((s) => s.merchantId === shopId);

  const form = useForm<ManualBookingFormInput>({
    resolver: zodResolver(ManualBookingSchema),
    defaultValues: {
      shopId,
      customerName: '',
      customerPhone: '',
      staffId: defaultStaffId ?? staffOptions[0]?.id ?? '',
      serviceName: '',
      scheduledAt: toDatetimeLocal(defaultStart),
      durationMinutes: 60,
      amount: 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        shopId,
        customerName: '',
        customerPhone: '',
        staffId: defaultStaffId ?? staffOptions[0]?.id ?? '',
        serviceName: '',
        scheduledAt: toDatetimeLocal(defaultStart),
        durationMinutes: 60,
        amount: 0,
      });
    }
  }, [open, shopId, defaultStart, defaultStaffId, form, staffOptions]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={t('manualBooking.title')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="manual-booking-form" disabled={mutation.isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <form id="manual-booking-form" onSubmit={onSubmit} className={cn(formSheet.form)}>
          <Input placeholder={t('manualBooking.customerName')} {...form.register('customerName')} />
          <Input placeholder={t('manualBooking.customerPhone')} {...form.register('customerPhone')} />
          <Select
            value={form.watch('staffId')}
            onValueChange={(value) => form.setValue('staffId', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('filters.staff')} />
            </SelectTrigger>
            <SelectContent>
              {staffOptions.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder={t('manualBooking.serviceName')} {...form.register('serviceName')} />
          <Input type="datetime-local" {...form.register('scheduledAt')} />
          <Input
            type="number"
            placeholder={t('manualBooking.duration')}
            {...form.register('durationMinutes', { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder={t('manualBooking.amount')}
            {...form.register('amount', { valueAsNumber: true })}
          />
        </form>
      </FormSheetContent>
    </Sheet>
  );
}
