import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import type { PaymentListItem } from '@/features/payments/types/payment';
import { Badge } from '@/shared/components/ui/badge';

type PaymentMobileCardProps = {
  payment: PaymentListItem;
};

export function PaymentMobileCard({ payment }: PaymentMobileCardProps): React.ReactElement {
  const { t } = useTranslation('payments');

  return (
    <div className="space-y-2 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{payment.bookingRef}</p>
          <p className="text-sm text-muted-foreground">{payment.customerName}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{formatInrFromPaise(payment.amountPaise)}</span>
        <Badge variant="outline">{t(`method.${payment.method}`)}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {payment.shopName} · {format(new Date(payment.createdAt), 'dd MMM yyyy, HH:mm')}
      </p>
    </div>
  );
}
