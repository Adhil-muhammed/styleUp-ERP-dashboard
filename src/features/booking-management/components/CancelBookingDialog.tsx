import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmWithReasonDialog } from '@/shared/components/confirm-dialog/ConfirmWithReasonDialog';

export type CancelBookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (reason?: string) => void;
  isPending?: boolean;
};

export function CancelBookingDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isPending = false,
}: CancelBookingDialogProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  return (
    <ConfirmWithReasonDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant="destructive"
      onConfirm={onConfirm}
      isPending={isPending}
      reasonLabel={t('confirm.reasonLabel')}
      reasonPlaceholder={t('confirm.reasonPlaceholder')}
    />
  );
}
