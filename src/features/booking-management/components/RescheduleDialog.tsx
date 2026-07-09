import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useRescheduleBookingMutation } from '@/features/booking-management/hooks/use-booking-management-queries';
import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import {
  RescheduleBookingSchema,
  type RescheduleBookingInput,
} from '@/features/booking-management/types/booking.schema';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

type RescheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingDetail;
};

export function RescheduleDialog({
  open,
  onOpenChange,
  booking,
}: RescheduleDialogProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const mutation = useRescheduleBookingMutation(booking.id);

  const form = useForm<RescheduleBookingInput>({
    resolver: zodResolver(RescheduleBookingSchema),
    defaultValues: { scheduledAt: toDatetimeLocalValue(booking.scheduledAt) },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ scheduledAt: toDatetimeLocalValue(booking.scheduledAt) });
  }, [open, booking.id, booking.scheduledAt]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('reschedule.title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <form id="reschedule-booking-form" onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="scheduledAt" className="text-sm font-medium">
              {t('reschedule.dateTime')}
            </label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...form.register('scheduledAt')}
            />
            {form.formState.errors.scheduledAt?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.scheduledAt.message}
              </p>
            ) : null}
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            {t('actions.dismiss')}
          </AlertDialogCancel>
          <Button
            type="submit"
            form="reschedule-booking-form"
            disabled={mutation.isPending}
          >
            {t('actions.reschedule')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
