import { IndianRupee, Percent, RotateCcw, Wallet } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { formatInrFromPaise } from '@/features/payments/lib/format-payment';
import { usePaymentKpisQuery } from '@/features/payments/hooks/use-payments-queries';
import type { PaymentKpiPeriod } from '@/features/payments/types/payment-kpis';
import { PAYMENT_KPI_PERIODS } from '@/features/payments/types/payment-kpis';
import { ResponsiveGrid } from '@/shared/components/layout/ResponsiveGrid';
import { KpiCard, KpiCardSkeleton } from '@/shared/components/kpi/KpiCard';
import { QuerySection } from '@/shared/components/query/QuerySection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useScope } from '@/shared/hooks/use-scope';

function KpiGridSkeleton(): React.ReactElement {
  return (
    <ResponsiveGrid preset="kpiCards">
      {Array.from({ length: 4 }).map((_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
    </ResponsiveGrid>
  );
}

export function PaymentKpiCards(): React.ReactElement {
  const { t } = useTranslation('payments');
  const { merchantId } = useScope();
  const [period, setPeriod] = useState<PaymentKpiPeriod>('30d');
  const { data, isPending, isError } = usePaymentKpisQuery(period, merchantId);

  return (
    <section className="space-y-3" data-testid="payment-kpi-cards">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{t('kpis.title')}</h2>
        <Select value={period} onValueChange={(value) => setPeriod(value as PaymentKpiPeriod)}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_KPI_PERIODS.map((item) => (
              <SelectItem key={item} value={item}>
                {t(`kpis.period.${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={!data}
        emptyMessage={t('empty.kpis')}
        skeleton={<KpiGridSkeleton />}
      >
        {data ? (
          <ResponsiveGrid preset="kpiCards">
            <KpiCard
              label={t('kpis.totalRevenue')}
              value={formatInrFromPaise(data.totalRevenuePaise)}
              icon={IndianRupee}
            />
            <KpiCard
              label={t('kpis.totalRefunds')}
              value={formatInrFromPaise(data.totalRefundsPaise)}
              icon={RotateCcw}
            />
            <KpiCard
              label={t('kpis.successRate')}
              value={`${data.successRatePercent}%`}
              icon={Percent}
            />
            <KpiCard
              label={t('kpis.pendingSettlements')}
              value={formatInrFromPaise(data.pendingSettlementsPaise)}
              icon={Wallet}
            />
          </ResponsiveGrid>
        ) : null}
      </QuerySection>
    </section>
  );
}
