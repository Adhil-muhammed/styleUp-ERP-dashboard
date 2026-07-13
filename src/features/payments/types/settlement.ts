export const SETTLEMENT_STATUSES = ['pending', 'processing', 'paid'] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export type SettlementSummaryItem = {
  id: string;
  shopId: string;
  shopName: string;
  periodStart: string;
  periodEnd: string;
  grossRevenuePaise: number;
  platformCommissionPaise: number;
  netPayablePaise: number;
  status: SettlementStatus;
};

export type SettlementListParams = {
  shopId?: string;
  periodStart?: string;
  periodEnd?: string;
  merchantId?: string | null;
};
