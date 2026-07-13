/**
 * Payments API — fixture-backed until backend endpoints are live.
 *
 * Future endpoints:
 * - GET  /payments?cursor&limit&status&method&shopId&dateFrom&dateTo&amountMinPaise&amountMaxPaise&search&sortBy&sortOrder&merchantId
 * - GET  /payments/:id
 * - POST /payments/:id/refunds
 * - GET  /payments/kpis?period&merchantId
 * - GET  /payments/settlements?shopId&periodStart&periodEnd&merchantId
 * - GET  /payments/export?...same filters as list
 */
import { paymentDetailsFixture } from '@/features/payments/api/fixtures/payment-details.fixture';
import { paymentsFixture } from '@/features/payments/api/fixtures/payments.fixture';
import { settlementsFixture } from '@/features/payments/api/fixtures/settlements.fixture';
import type { PaymentDetail } from '@/features/payments/types/payment-detail';
import type { PaymentKpiPeriod, PaymentKpis } from '@/features/payments/types/payment-kpis';
import type { CreateRefundInput } from '@/features/payments/types/payment.schema';
import type { PaymentListItem, PaymentListParams } from '@/features/payments/types/payment';
import type { RefundRecord } from '@/features/payments/types/refund';
import type {
  SettlementListParams,
  SettlementSummaryItem,
} from '@/features/payments/types/settlement';
import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import { mockDelay } from '@/shared/lib/mock-delay';
import { downloadCsv } from '@/shared/lib/export-csv';
import type { ApiMutationResponse } from '@/shared/types/api';
import type { CursorPaginatedResponse } from '@/shared/types/common';

const DEFAULT_LIMIT = 20;

type PaymentRecord = PaymentListItem;

function buildInitialStore(): PaymentRecord[] {
  return paymentsFixture.map((payment) => ({ ...payment }));
}

let paymentsStore: PaymentRecord[] = buildInitialStore();
let paymentDetailsStore: Record<string, PaymentDetail> = { ...paymentDetailsFixture };
let refundCounter = 1000;

function encodeCursor(createdAt: string, id: string): string {
  return btoa(`${createdAt}:${id}`);
}

function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
  try {
    const decoded = atob(cursor);
    const separatorIndex = decoded.lastIndexOf(':');
    if (separatorIndex === -1) {
      return null;
    }
    return {
      createdAt: decoded.slice(0, separatorIndex),
      id: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function matchesSearch(payment: PaymentRecord, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }
  return (
    payment.id.toLowerCase().includes(query) ||
    payment.bookingRef.toLowerCase().includes(query) ||
    payment.bookingId.toLowerCase().includes(query) ||
    payment.customerName.toLowerCase().includes(query)
  );
}

function filterPayments(params: PaymentListParams): PaymentRecord[] {
  let items = paymentsStore.filter((payment) => payment.deletedAt === null);

  if (params.merchantId) {
    items = items.filter((payment) => payment.shopId === params.merchantId);
  }

  if (params.shopId) {
    items = items.filter((payment) => payment.shopId === params.shopId);
  }

  if (params.status) {
    items = items.filter((payment) => payment.status === params.status);
  }

  if (params.method) {
    items = items.filter((payment) => payment.method === params.method);
  }

  if (params.dateFrom) {
    const from = new Date(params.dateFrom).getTime();
    items = items.filter((payment) => new Date(payment.createdAt).getTime() >= from);
  }

  if (params.dateTo) {
    const to = new Date(params.dateTo).getTime() + 86_400_000 - 1;
    items = items.filter((payment) => new Date(payment.createdAt).getTime() <= to);
  }

  if (params.amountMinPaise !== undefined) {
    items = items.filter((payment) => payment.amountPaise >= params.amountMinPaise!);
  }

  if (params.amountMaxPaise !== undefined) {
    items = items.filter((payment) => payment.amountPaise <= params.amountMaxPaise!);
  }

  if (params.search) {
    items = items.filter((payment) => matchesSearch(payment, params.search!));
  }

  const sortBy = params.sortBy ?? 'createdAt';
  const sortOrder = params.sortOrder ?? 'desc';

  items.sort((left, right) => {
    const direction = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'amountPaise') {
      return (left.amountPaise - right.amountPaise) * direction;
    }
    return (new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()) * direction;
  });

  return items;
}

function paginateWithCursor(
  items: PaymentRecord[],
  params: PaymentListParams
): CursorPaginatedResponse<PaymentRecord> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  let startIndex = 0;

  if (params.cursor) {
    const decoded = decodeCursor(params.cursor);
    if (decoded) {
      const cursorIndex = items.findIndex(
        (payment) => payment.id === decoded.id && payment.createdAt === decoded.createdAt
      );
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }
  }

  const slice = items.slice(startIndex, startIndex + limit + 1);
  const hasMore = slice.length > limit;
  const pageItems = hasMore ? slice.slice(0, limit) : slice;
  const lastItem = pageItems.at(-1);

  return {
    items: pageItems,
    page: {
      nextCursor: hasMore && lastItem ? encodeCursor(lastItem.createdAt, lastItem.id) : null,
      hasMore,
    },
  };
}

function getPeriodRange(period: PaymentKpiPeriod): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date();

  switch (period) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      break;
    case '7d':
      from.setDate(from.getDate() - 7);
      break;
    case '30d':
      from.setDate(from.getDate() - 30);
      break;
    case 'month':
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      break;
  }

  return { from, to };
}

function syncDetailFromPayment(payment: PaymentRecord): void {
  const existing = paymentDetailsStore[payment.id];
  if (!existing) {
    return;
  }

  paymentDetailsStore[payment.id] = {
    ...existing,
    ...payment,
    statusTimeline: existing.statusTimeline,
    refunds: existing.refunds,
    rawGatewayResponse: existing.rawGatewayResponse,
    booking: existing.booking,
    razorpayPaymentId: existing.razorpayPaymentId,
    razorpayOrderId: existing.razorpayOrderId,
    gatewayTransactionId: existing.gatewayTransactionId,
    upiIntentUrl: existing.upiIntentUrl,
  };
}

function findPayment(id: string): PaymentRecord {
  const payment = paymentsStore.find((item) => item.id === id && item.deletedAt === null);
  if (!payment) {
    throw new Error(`Payment not found: ${id}`);
  }
  return payment;
}

export async function getPayments(
  params: PaymentListParams
): Promise<CursorPaginatedResponse<PaymentListItem>> {
  const filtered = filterPayments(params);
  return mockDelay(paginateWithCursor(filtered, params));
}

export async function getPaymentById(id: string): Promise<PaymentDetail> {
  const payment = findPayment(id);
  const detail = paymentDetailsStore[id];
  if (!detail) {
    throw new Error(`Payment detail not found: ${id}`);
  }
  return mockDelay({ ...detail, ...payment });
}

export async function createRefund(
  paymentId: string,
  input: CreateRefundInput
): Promise<ApiMutationResponse & { refund: RefundRecord }> {
  const payment = findPayment(paymentId);
  const remainingPaise = payment.amountPaise - payment.refundedAmountPaise;

  if (payment.status !== 'success' && payment.status !== 'partially_refunded') {
    throw new Error('Only successful transactions can be refunded');
  }

  const refundAmountPaise = input.type === 'full' ? remainingPaise : (input.amountPaise ?? 0);

  if (refundAmountPaise <= 0 || refundAmountPaise > remainingPaise) {
    throw new Error('Invalid refund amount');
  }

  const refund: RefundRecord = {
    id: `ref-${++refundCounter}`,
    paymentId,
    amountPaise: refundAmountPaise,
    reason: input.reason,
    note: input.note,
    status: 'requested',
    requestedAt: new Date().toISOString(),
  };

  const nextRefundedAmount = payment.refundedAmountPaise + refundAmountPaise;
  const nextStatus = nextRefundedAmount >= payment.amountPaise ? 'refunded' : 'partially_refunded';

  const paymentIndex = paymentsStore.findIndex((item) => item.id === paymentId);
  paymentsStore[paymentIndex] = {
    ...payment,
    refundedAmountPaise: nextRefundedAmount,
    status: nextStatus,
  };

  const detail = paymentDetailsStore[paymentId];
  if (detail) {
    paymentDetailsStore[paymentId] = {
      ...detail,
      ...paymentsStore[paymentIndex],
      refunds: [...detail.refunds, refund],
      statusTimeline: [
        ...detail.statusTimeline,
        {
          status: nextStatus,
          at: refund.requestedAt,
          note: `Refund requested: ${formatInrFromPaise(refundAmountPaise)}`,
        },
      ],
    };
  }

  syncDetailFromPayment(paymentsStore[paymentIndex]);

  return mockDelay({ success: true, refund });
}

export async function getPaymentKpis(
  period: PaymentKpiPeriod,
  merchantId: string | null
): Promise<PaymentKpis> {
  const { from, to } = getPeriodRange(period);
  const payments = filterPayments({ merchantId }).filter((payment) => {
    const createdAt = new Date(payment.createdAt).getTime();
    return createdAt >= from.getTime() && createdAt <= to.getTime();
  });

  const successful = payments.filter((payment) =>
    ['success', 'partially_refunded', 'refunded'].includes(payment.status)
  );
  const totalRevenuePaise = successful.reduce(
    (sum, payment) => sum + payment.amountPaise - payment.refundedAmountPaise,
    0
  );
  const totalRefundsPaise = payments.reduce((sum, payment) => sum + payment.refundedAmountPaise, 0);
  const attempted = payments.filter((payment) => payment.status !== 'pending');
  const successRatePercent =
    attempted.length === 0 ? 0 : Math.round((successful.length / attempted.length) * 100);

  let settlements = settlementsFixture;
  if (merchantId) {
    settlements = settlements.filter((item) => item.shopId === merchantId);
  }
  const pendingSettlementsPaise = settlements
    .filter((item) => item.status === 'pending' || item.status === 'processing')
    .reduce((sum, item) => sum + item.netPayablePaise, 0);

  return mockDelay({
    totalRevenuePaise,
    totalRefundsPaise,
    successRatePercent,
    pendingSettlementsPaise,
  });
}

export async function getSettlements(
  params: SettlementListParams
): Promise<SettlementSummaryItem[]> {
  let items = [...settlementsFixture];

  if (params.merchantId) {
    items = items.filter((item) => item.shopId === params.merchantId);
  }

  if (params.shopId) {
    items = items.filter((item) => item.shopId === params.shopId);
  }

  if (params.periodStart) {
    const from = new Date(params.periodStart).getTime();
    items = items.filter((item) => new Date(item.periodStart).getTime() >= from);
  }

  if (params.periodEnd) {
    const to = new Date(params.periodEnd).getTime();
    items = items.filter((item) => new Date(item.periodEnd).getTime() <= to);
  }

  return mockDelay(items);
}

export async function exportPaymentsCsv(params: PaymentListParams): Promise<void> {
  const items = filterPayments({ ...params, cursor: null, limit: undefined });
  downloadCsv(
    `payments-export-${new Date().toISOString().slice(0, 10)}.csv`,
    [
      'Transaction ID',
      'Booking Ref',
      'Customer',
      'Shop',
      'Amount (INR)',
      'Refunded (INR)',
      'Method',
      'Gateway',
      'Status',
      'Date',
    ],
    items.map((payment) => [
      payment.id,
      payment.bookingRef,
      payment.customerName,
      payment.shopName,
      payment.amountPaise / 100,
      payment.refundedAmountPaise / 100,
      payment.method,
      payment.gateway,
      payment.status,
      payment.createdAt,
    ])
  );
  return mockDelay(undefined);
}

export async function downloadPaymentReceipt(paymentId: string): Promise<void> {
  const payment = findPayment(paymentId);
  const receiptContent = [
    'StyleQuest Payment Receipt',
    `Transaction: ${payment.id}`,
    `Booking: ${payment.bookingRef}`,
    `Amount: ${formatInrFromPaise(payment.amountPaise)}`,
    `Status: ${payment.status}`,
    `Date: ${payment.createdAt}`,
  ].join('\n');

  const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${payment.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);

  return mockDelay(undefined);
}
