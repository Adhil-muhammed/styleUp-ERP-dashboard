import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import { usePaymentDetailQuery } from '@/features/payments/hooks/use-payments-queries';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import type { PaymentListItem } from '@/features/payments/types/payment';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

type TransactionDetailContentProps = {
  paymentId: string;
  onRefund?: (payment: PaymentListItem) => void;
};

function DetailSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-5 w-full" />
      ))}
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export function TransactionDetailContent({
  paymentId,
  onRefund,
}: TransactionDetailContentProps): React.ReactElement {
  const { t } = useTranslation('payments');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.payments.manage);
  const { data, isPending, isError } = usePaymentDetailQuery(paymentId);

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">{t('detail.loadError')}</p>;
  }

  const netAmountPaise = data.amountPaise - data.refundedAmountPaise;
  const canRefund =
    canManage &&
    (data.status === 'success' || data.status === 'partially_refunded') &&
    data.refundedAmountPaise < data.amountPaise;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-lg font-semibold">{data.bookingRef}</p>
          <p className="text-sm text-muted-foreground">{data.id}</p>
        </div>
        <PaymentStatusBadge status={data.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField label={t('detail.customer')} value={data.customerName} />
        <DetailField label={t('detail.shop')} value={data.shopName} />
        <DetailField
          label={t('detail.amount')}
          value={formatInrFromPaise(data.amountPaise)}
        />
        <DetailField
          label={t('detail.refunded')}
          value={formatInrFromPaise(data.refundedAmountPaise)}
        />
        <DetailField label={t('detail.net')} value={formatInrFromPaise(netAmountPaise)} />
        <DetailField label={t('detail.method')} value={t(`method.${data.method}`)} />
        <DetailField
          label={t('detail.gateway')}
          value={<Badge variant="outline">{t(`gateway.${data.gateway}`)}</Badge>}
        />
        <DetailField
          label={t('detail.date')}
          value={format(new Date(data.createdAt), 'dd MMM yyyy, HH:mm')}
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">{t('detail.bookingTitle')}</h3>
        <div className="grid gap-3 rounded-lg border p-4 text-sm">
          <DetailField label={t('detail.service')} value={data.booking.serviceName} />
          <DetailField
            label={t('detail.scheduledAt')}
            value={format(new Date(data.booking.scheduledAt), 'dd MMM yyyy, HH:mm')}
          />
          <DetailField
            label={t('detail.bookingStatus')}
            value={data.booking.bookingStatus}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">{t('detail.gatewayIds')}</h3>
        <div className="grid gap-3 rounded-lg border p-4 text-sm">
          <DetailField label={t('detail.gatewayTransactionId')} value={data.gatewayTransactionId} />
          <DetailField label={t('detail.razorpayPaymentId')} value={data.razorpayPaymentId} />
          <DetailField label={t('detail.razorpayOrderId')} value={data.razorpayOrderId} />
          {data.upiIntentUrl ? (
            <DetailField
              label={t('detail.upiIntentUrl')}
              value={<span className="break-all text-xs">{data.upiIntentUrl}</span>}
            />
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">{t('detail.timeline')}</h3>
        <div className="space-y-2">
          {data.statusTimeline.map((entry, index) => (
            <div key={`${entry.at}-${index}`} className="rounded-lg border px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{entry.status}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.at), 'dd MMM yyyy, HH:mm')}
                </span>
              </div>
              {entry.note ? (
                <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">{t('detail.refunds')}</h3>
        {data.refunds.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('detail.noRefunds')}</p>
        ) : (
          <div className="space-y-2">
            {data.refunds.map((refund) => (
              <div key={refund.id} className="rounded-lg border px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{formatInrFromPaise(refund.amountPaise)}</span>
                  <Badge variant="secondary">{t(`refund.status.${refund.status}`)}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(`refund.reason.${refund.reason}`)} ·{' '}
                  {format(new Date(refund.requestedAt), 'dd MMM yyyy, HH:mm')}
                </p>
                {refund.note ? (
                  <p className="mt-1 text-xs text-muted-foreground">{refund.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <Accordion type="single" collapsible>
        <AccordionItem value="raw-response">
          <AccordionTrigger>{t('detail.rawGatewayResponse')}</AccordionTrigger>
          <AccordionContent>
            <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(data.rawGatewayResponse, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {canRefund && onRefund ? (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onRefund({
              id: data.id,
              bookingId: data.bookingId,
              bookingRef: data.bookingRef,
              customerId: data.customerId,
              customerName: data.customerName,
              shopId: data.shopId,
              shopName: data.shopName,
              amountPaise: data.amountPaise,
              refundedAmountPaise: data.refundedAmountPaise,
              method: data.method,
              gateway: data.gateway,
              status: data.status,
              createdAt: data.createdAt,
              deletedAt: data.deletedAt,
            })
          }
        >
          {t('actions.refund')}
        </Button>
      ) : null}
    </div>
  );
}
