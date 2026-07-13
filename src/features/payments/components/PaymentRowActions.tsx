import { Download, Eye, RotateCcw } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { downloadPaymentReceipt } from '@/features/payments/api/payments-api';
import type { PaymentListItem } from '@/features/payments/types/payment';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

export type PaymentRowActionsProps = {
  payment: PaymentListItem;
  onViewDetails: (payment: PaymentListItem) => void;
  onRefund: (payment: PaymentListItem) => void;
};

export function PaymentRowActions({
  payment,
  onViewDetails,
  onRefund,
}: PaymentRowActionsProps): React.ReactElement {
  const { t } = useTranslation('payments');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.payments.manage);
  const canRefund =
    canManage &&
    (payment.status === 'success' || payment.status === 'partially_refunded') &&
    payment.refundedAmountPaise < payment.amountPaise;

  const handleDownloadReceipt = (): void => {
    void downloadPaymentReceipt(payment.id);
  };

  return (
    <ActionMenu
      triggerLabel={t('actions.menu')}
      items={[
        {
          id: 'view',
          label: t('actions.viewDetails'),
          icon: Eye,
          onSelect: () => onViewDetails(payment),
        },
        {
          id: 'refund',
          label: t('actions.refund'),
          icon: RotateCcw,
          onSelect: () => onRefund(payment),
          hidden: !canRefund,
        },
        {
          id: 'receipt',
          label: t('actions.downloadReceipt'),
          icon: Download,
          onSelect: handleDownloadReceipt,
          hidden: payment.status !== 'success' && payment.status !== 'partially_refunded' && payment.status !== 'refunded',
        },
      ]}
    />
  );
}
