import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { RefundConfirmDialog } from '@/features/payments/components/RefundConfirmDialog';
import { useCreateRefundMutation } from '@/features/payments/hooks/use-payments-queries';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import { CreateRefundSchema, type CreateRefundInput } from '@/features/payments/types/payment.schema';
import type { PaymentListItem, PaymentListParams } from '@/features/payments/types/payment';
import { REFUND_REASONS } from '@/features/payments/types/refund';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Sheet } from '@/shared/components/ui/sheet';
import { Textarea } from '@/shared/components/ui/textarea';

type RefundModalProps = {
  payment: PaymentListItem | null;
  listParams: PaymentListParams;
  onClose: () => void;
};

export function RefundModal({
  payment,
  listParams,
  onClose,
}: RefundModalProps): React.ReactElement {
  const { t } = useTranslation('payments');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<CreateRefundInput | null>(null);
  const refundMutation = useCreateRefundMutation(listParams);

  const remainingPaise = payment ? payment.amountPaise - payment.refundedAmountPaise : 0;

  const form = useForm<CreateRefundInput>({
    resolver: zodResolver(CreateRefundSchema),
    defaultValues: {
      type: 'full',
      reason: 'customer_request',
      note: '',
    },
  });

  const refundType = form.watch('type');

  const refundAmountPaise = useMemo(() => {
    if (!payment || !pendingValues) {
      return 0;
    }
    return pendingValues.type === 'full'
      ? remainingPaise
      : (pendingValues.amountPaise ?? 0);
  }, [payment, pendingValues, remainingPaise]);

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      form.reset();
      setPendingValues(null);
      setConfirmOpen(false);
      onClose();
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    setPendingValues(values);
    setConfirmOpen(true);
  });

  const handleConfirm = (): void => {
    if (!payment || !pendingValues) {
      return;
    }

    refundMutation.mutate(
      { paymentId: payment.id, input: pendingValues },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          handleOpenChange(false);
        },
      },
    );
  };

  return (
    <>
      <Sheet open={payment !== null} onOpenChange={handleOpenChange}>
        <FormSheetContent
          title={payment ? t('refund.title', { ref: payment.bookingRef }) : t('refund.titleGeneric')}
          footer={
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                {t('refund.cancel')}
              </Button>
              <Button type="submit" form="refund-form" variant="destructive">
                {t('refund.review')}
              </Button>
            </div>
          }
        >
          {payment ? (
            <form id="refund-form" className="space-y-4" onSubmit={handleSubmit}>
              <p className="text-sm text-muted-foreground">
                {t('refund.remaining', { amount: formatInrFromPaise(remainingPaise) })}
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('refund.type')}</label>
                <Select
                  value={refundType}
                  onValueChange={(value) =>
                    form.setValue('type', value as CreateRefundInput['type'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">{t('refund.full')}</SelectItem>
                    <SelectItem value="partial">{t('refund.partial')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {refundType === 'partial' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="refund-amount">
                    {t('refund.amount')}
                  </label>
                  <Input
                    id="refund-amount"
                    type="number"
                    min={1}
                    max={remainingPaise / 100}
                    step="0.01"
                    onChange={(event) => {
                      const rupees = Number(event.target.value);
                      form.setValue('amountPaise', Math.round(rupees * 100));
                    }}
                  />
                  {form.formState.errors.amountPaise?.message ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.amountPaise.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('refund.reasonLabel')}</label>
                <Select
                  value={form.watch('reason')}
                  onValueChange={(value) =>
                    form.setValue('reason', value as CreateRefundInput['reason'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFUND_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {t(`refund.reason.${reason}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="refund-note">
                  {t('refund.note')}
                </label>
                <Textarea
                  id="refund-note"
                  rows={3}
                  {...form.register('note')}
                  placeholder={t('refund.notePlaceholder')}
                />
              </div>
            </form>
          ) : null}
        </FormSheetContent>
      </Sheet>

      <RefundConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        amountLabel={formatInrFromPaise(refundAmountPaise)}
        onConfirm={handleConfirm}
        isPending={refundMutation.isPending}
      />
    </>
  );
}
