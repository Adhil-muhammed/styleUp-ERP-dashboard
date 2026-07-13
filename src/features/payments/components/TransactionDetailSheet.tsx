import type React from 'react';
import { useTranslation } from 'react-i18next';

import { TransactionDetailContent } from '@/features/payments/components/TransactionDetailContent';
import type { PaymentListItem } from '@/features/payments/types/payment';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Sheet } from '@/shared/components/ui/sheet';

type TransactionDetailSheetProps = {
  paymentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefund?: (payment: PaymentListItem) => void;
};

export function TransactionDetailSheet({
  paymentId,
  open,
  onOpenChange,
  onRefund,
}: TransactionDetailSheetProps): React.ReactElement {
  const { t } = useTranslation('payments');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        className="sm:max-w-lg"
        title={paymentId ? t('detail.title', { id: paymentId }) : t('detail.loadingTitle')}
        footer={<div />}
      >
        {paymentId ? (
          <TransactionDetailContent paymentId={paymentId} onRefund={onRefund} />
        ) : null}
      </FormSheetContent>
    </Sheet>
  );
}
