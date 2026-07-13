import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';

type RefundConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export function RefundConfirmDialog({
  open,
  onOpenChange,
  amountLabel,
  onConfirm,
  isPending = false,
}: RefundConfirmDialogProps): React.ReactElement {
  const { t } = useTranslation('payments');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('refund.confirmTitle')}
      description={t('refund.confirmDescription', { amount: amountLabel })}
      confirmLabel={t('refund.confirm')}
      cancelLabel={t('refund.cancel')}
      variant="destructive"
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
