import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createRefund,
  exportPaymentsCsv,
  getPaymentById,
  getPaymentKpis,
  getPayments,
  getSettlements,
} from '@/features/payments/api/payments-api';
import type { PaymentDetail } from '@/features/payments/types/payment-detail';
import type { PaymentKpiPeriod } from '@/features/payments/types/payment-kpis';
import type { CreateRefundInput } from '@/features/payments/types/payment.schema';
import type { PaymentListItem, PaymentListParams } from '@/features/payments/types/payment';
import type { SettlementListParams } from '@/features/payments/types/settlement';
import type { CursorPaginatedResponse } from '@/shared/types/common';

function useInvalidatePayments() {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });
    void queryClient.invalidateQueries({ queryKey: ['payments', 'detail'] });
    void queryClient.invalidateQueries({ queryKey: ['payments', 'kpis'] });
    void queryClient.invalidateQueries({ queryKey: ['payments', 'settlements'] });
  };
}

export function usePaymentListQuery(params: PaymentListParams) {
  return useQuery({
    queryKey: ['payments', 'list', params],
    queryFn: () => getPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentDetailQuery(id: string) {
  return useQuery({
    queryKey: ['payments', 'detail', id],
    queryFn: () => getPaymentById(id),
    enabled: Boolean(id),
  });
}

export function usePaymentKpisQuery(period: PaymentKpiPeriod, merchantId: string | null) {
  return useQuery({
    queryKey: ['payments', 'kpis', { period, merchantId }],
    queryFn: () => getPaymentKpis(period, merchantId),
  });
}

export function useSettlementListQuery(params: SettlementListParams) {
  return useQuery({
    queryKey: ['payments', 'settlements', params],
    queryFn: () => getSettlements(params),
  });
}

export function useCreateRefundMutation(listParams: PaymentListParams) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePayments();

  return useMutation({
    mutationFn: ({ paymentId, input }: { paymentId: string; input: CreateRefundInput }) =>
      createRefund(paymentId, input),
    onMutate: async ({ paymentId, input }) => {
      await queryClient.cancelQueries({ queryKey: ['payments', 'list', listParams] });
      await queryClient.cancelQueries({ queryKey: ['payments', 'detail', paymentId] });

      const previousList = queryClient.getQueryData<CursorPaginatedResponse<PaymentListItem>>([
        'payments',
        'list',
        listParams,
      ]);
      const previousDetail = queryClient.getQueryData<PaymentDetail>([
        'payments',
        'detail',
        paymentId,
      ]);

      if (previousList) {
        const payment = previousList.items.find((item) => item.id === paymentId);
        if (payment) {
          const remainingPaise = payment.amountPaise - payment.refundedAmountPaise;
          const refundAmountPaise =
            input.type === 'full' ? remainingPaise : (input.amountPaise ?? 0);
          const nextRefundedAmount = payment.refundedAmountPaise + refundAmountPaise;
          const nextStatus =
            nextRefundedAmount >= payment.amountPaise ? 'refunded' : 'partially_refunded';

          queryClient.setQueryData(['payments', 'list', listParams], {
            ...previousList,
            items: previousList.items.map((item) =>
              item.id === paymentId
                ? {
                    ...item,
                    refundedAmountPaise: nextRefundedAmount,
                    status: nextStatus,
                  }
                : item,
            ),
          });
        }
      }

      if (previousDetail) {
        const remainingPaise =
          previousDetail.amountPaise - previousDetail.refundedAmountPaise;
        const refundAmountPaise =
          input.type === 'full' ? remainingPaise : (input.amountPaise ?? 0);

        queryClient.setQueryData(['payments', 'detail', paymentId], {
          ...previousDetail,
          refundedAmountPaise: previousDetail.refundedAmountPaise + refundAmountPaise,
          status:
            previousDetail.refundedAmountPaise + refundAmountPaise >= previousDetail.amountPaise
              ? 'refunded'
              : 'partially_refunded',
          refunds: [
            ...previousDetail.refunds,
            {
              id: `opt-ref-${paymentId}`,
              paymentId,
              amountPaise: refundAmountPaise,
              reason: input.reason,
              note: input.note,
              status: 'requested' as const,
              requestedAt: new Date().toISOString(),
            },
          ],
        });
      }

      return { previousList, previousDetail, paymentId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['payments', 'list', listParams], context.previousList);
      }
      if (context?.previousDetail && context.paymentId) {
        queryClient.setQueryData(
          ['payments', 'detail', context.paymentId],
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['payments', 'detail', variables.paymentId],
      });
    },
  });
}

export function useExportPaymentsMutation() {
  return useMutation({
    mutationFn: (params: PaymentListParams) => exportPaymentsCsv(params),
  });
}
