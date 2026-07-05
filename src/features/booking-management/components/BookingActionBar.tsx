import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CancelBookingDialog } from '@/features/booking-management/components/CancelBookingDialog';
import { RescheduleDialog } from '@/features/booking-management/components/RescheduleDialog';
import {
  useCancelBookingMutation,
  useCompleteBookingMutation,
  useConfirmBookingMutation,
  useMarkNoShowMutation,
} from '@/features/booking-management/hooks/use-booking-management-queries';
import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

type BookingActionBarProps = {
  data: BookingDetail;
};

type DialogAction = 'confirm' | 'complete' | 'cancel' | 'noShow' | 'reschedule' | null;

export function BookingActionBar({ data }: BookingActionBarProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.bookings.manage);

  const [dialogAction, setDialogAction] = useState<DialogAction>(null);

  const confirmMutation = useConfirmBookingMutation(data.id);
  const completeMutation = useCompleteBookingMutation(data.id);
  const cancelMutation = useCancelBookingMutation(data.id);
  const noShowMutation = useMarkNoShowMutation(data.id);

  const isPending =
    confirmMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending ||
    noShowMutation.isPending;

  const scheduledAtMs = new Date(data.scheduledAt).getTime();
  const isPastOrOngoing = scheduledAtMs <= Date.now();

  if (!canManage) {
    return (
      <p className="text-sm text-muted-foreground">{t('actions.readOnly')}</p>
    );
  }

  if (data.status === 'completed' || data.status === 'cancelled' || data.status === 'no_show') {
    return (
      <p className="text-sm text-muted-foreground">{t('actions.noActionsAvailable')}</p>
    );
  }

  const closeDialog = (): void => setDialogAction(null);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {data.status === 'pending' ? (
          <>
            <Button
              disabled={isPending}
              onClick={() => setDialogAction('confirm')}
            >
              {t('actions.confirm')}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => setDialogAction('cancel')}
            >
              {t('actions.cancel')}
            </Button>
          </>
        ) : null}

        {data.status === 'confirmed' ? (
          <>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setDialogAction('reschedule')}
            >
              {t('actions.reschedule')}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => setDialogAction('cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              disabled={isPending || !isPastOrOngoing}
              title={!isPastOrOngoing ? t('actions.completeDisabledHint') : undefined}
              onClick={() => setDialogAction('complete')}
            >
              {t('actions.complete')}
            </Button>
            <Button
              variant="secondary"
              disabled={isPending || !isPastOrOngoing}
              title={!isPastOrOngoing ? t('actions.noShowDisabledHint') : undefined}
              onClick={() => setDialogAction('noShow')}
            >
              {t('actions.noShow')}
            </Button>
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={dialogAction === 'confirm'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('confirm.confirm.title')}
        description={t('confirm.confirm.description', { customer: data.customerName })}
        confirmLabel={t('actions.confirm')}
        cancelLabel={t('actions.dismiss')}
        onConfirm={() => {
          confirmMutation.mutate(undefined, { onSuccess: closeDialog });
        }}
        isPending={confirmMutation.isPending}
      />

      <ConfirmDialog
        open={dialogAction === 'complete'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('confirm.complete.title')}
        description={t('confirm.complete.description', { customer: data.customerName })}
        confirmLabel={t('actions.complete')}
        cancelLabel={t('actions.dismiss')}
        onConfirm={() => {
          completeMutation.mutate(undefined, { onSuccess: closeDialog });
        }}
        isPending={completeMutation.isPending}
      />

      <CancelBookingDialog
        open={dialogAction === 'cancel'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('confirm.cancel.title')}
        description={t('confirm.cancel.description', { customer: data.customerName })}
        confirmLabel={t('actions.cancel')}
        cancelLabel={t('actions.dismiss')}
        onConfirm={(reason) => {
          cancelMutation.mutate({ reason }, { onSuccess: closeDialog });
        }}
        isPending={cancelMutation.isPending}
      />

      <CancelBookingDialog
        open={dialogAction === 'noShow'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('confirm.noShow.title')}
        description={t('confirm.noShow.description', { customer: data.customerName })}
        confirmLabel={t('actions.noShow')}
        cancelLabel={t('actions.dismiss')}
        onConfirm={(reason) => {
          noShowMutation.mutate({ reason }, { onSuccess: closeDialog });
        }}
        isPending={noShowMutation.isPending}
      />

      <RescheduleDialog
        open={dialogAction === 'reschedule'}
        onOpenChange={(open) => !open && closeDialog()}
        booking={data}
      />
    </>
  );
}
