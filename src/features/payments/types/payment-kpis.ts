export const PAYMENT_KPI_PERIODS = ['today', '7d', '30d', 'month'] as const;

export type PaymentKpiPeriod = (typeof PAYMENT_KPI_PERIODS)[number];

export type PaymentKpis = {
  totalRevenuePaise: number;
  totalRefundsPaise: number;
  successRatePercent: number;
  pendingSettlementsPaise: number;
};
