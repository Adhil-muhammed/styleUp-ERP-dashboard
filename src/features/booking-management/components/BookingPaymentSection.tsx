import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BookingPaymentStatusBadge } from '@/features/booking-management/components/BookingPaymentStatusBadge';
import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { formatInr } from '@/features/dashboard/lib/formatters';

type BookingPaymentSectionProps = {
  data: BookingDetail;
};

export function BookingPaymentSection({ data }: BookingPaymentSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { payment } = data;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.payment')}</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">{t('details.amount')}</dt>
          <dd className="font-medium">{formatInr(payment.amount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('details.paymentMethod')}</dt>
          <dd>{payment.method}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('list.paymentStatus')}</dt>
          <dd>
            <BookingPaymentStatusBadge status={payment.status} />
          </dd>
        </div>
        {payment.transactionId ? (
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t('details.transactionId')}</dt>
            <dd className="font-mono text-xs">{payment.transactionId}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
