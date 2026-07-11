import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateBookingMutation } from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { toDatetimeLocal } from '@/features/calendar-scheduling/lib/datetime-local';
import { ManualBookingSchema, type ManualBookingFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formSheet } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export type ManualBookingFormProps = {
  formId: string;
  shopId: string;
  defaultStart?: string;
  defaultStaffId?: string;
  active?: boolean;
  onSuccess: () => void;
  onPendingChange?: (pending: boolean) => void;
};

export function ManualBookingForm({
  formId,
  shopId,
  defaultStart,
  defaultStaffId,
  active = true,
  onSuccess,
  onPendingChange,
}: ManualBookingFormProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const mutation = useCreateBookingMutation();
  const staffOptions = useMemo(
    () => staffFixture.filter((s) => s.merchantId === shopId),
    [shopId],
  );
  const defaultStaffIdResolved = defaultStaffId ?? staffOptions[0]?.id ?? '';

  const form = useForm<ManualBookingFormInput>({
    resolver: zodResolver(ManualBookingSchema),
    defaultValues: {
      shopId,
      customerName: '',
      customerPhone: '',
      staffId: defaultStaffIdResolved,
      serviceName: '',
      scheduledAt: toDatetimeLocal(defaultStart),
      durationMinutes: 60,
      amount: 0,
    },
  });

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  useEffect(() => {
    if (!active) return;
    form.reset({
      shopId,
      customerName: '',
      customerPhone: '',
      staffId: defaultStaffIdResolved,
      serviceName: '',
      scheduledAt: toDatetimeLocal(defaultStart),
      durationMinutes: 60,
      amount: 0,
    });
  }, [active, shopId, defaultStart, defaultStaffId, defaultStaffIdResolved, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className={cn(formSheet.form)}>
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
  );
}
