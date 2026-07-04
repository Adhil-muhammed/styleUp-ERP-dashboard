import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useShopWorkingHoursQuery,
  useUpdateWorkingHoursMutation,
} from '@/features/merchant-management/hooks/use-merchant-management-queries';
import {
  DAYS_OF_WEEK,
  type DayOfWeek,
  type WorkingHours,
} from '@/features/merchant-management/types/working-hours';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Switch } from '@/shared/components/ui/switch';
import { Can } from '@/shared/lib/casl-context';
import { PERMISSIONS } from '@/shared/config/permissions';

type ShopWorkingHoursFormProps = {
  merchantId: string;
  initialHours: WorkingHours;
};

function ShopWorkingHoursForm({
  merchantId,
  initialHours,
}: ShopWorkingHoursFormProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const updateMutation = useUpdateWorkingHoursMutation(merchantId);
  const [hours, setHours] = useState<WorkingHours>(initialHours);

  const updateDay = (day: DayOfWeek, patch: Partial<WorkingHours[DayOfWeek]>): void => {
    setHours((current) => ({ ...current, [day]: { ...current[day], ...patch } }));
  };

  return (
    <div className="space-y-3">
      {DAYS_OF_WEEK.map((day) => (
        <div
          key={day}
          className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="w-24 text-sm font-medium">{t(`workingHours.days.${day}`)}</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={!hours[day].isClosed}
                onCheckedChange={(checked) => updateDay(day, { isClosed: !checked })}
              />
              {t('workingHours.open')}
            </label>
            <Input
              type="time"
              className="w-32"
              disabled={hours[day].isClosed}
              value={hours[day].openTime ?? ''}
              onChange={(event) => updateDay(day, { openTime: event.target.value })}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="time"
              className="w-32"
              disabled={hours[day].isClosed}
              value={hours[day].closeTime ?? ''}
              onChange={(event) => updateDay(day, { closeTime: event.target.value })}
            />
          </div>
        </div>
      ))}
      <Can I="manage" a={PERMISSIONS.merchants.manage}>
        <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate(hours)}>
          {t('form.save')}
        </Button>
      </Can>
    </div>
  );
}

type ShopWorkingHoursEditorProps = {
  merchantId: string;
};

export function ShopWorkingHoursEditor({
  merchantId,
}: ShopWorkingHoursEditorProps): React.ReactElement {
  const { data, isPending, isError } = useShopWorkingHoursQuery(merchantId);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-48 w-full" />}
    >
      {data ? (
        <ShopWorkingHoursForm
          key={`${merchantId}-${JSON.stringify(data)}`}
          merchantId={merchantId}
          initialHours={data}
        />
      ) : null}
    </QuerySection>
  );
}
