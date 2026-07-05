import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { RecurringPatternEditor } from '@/features/calendar-scheduling/components/recurring/RecurringPatternEditor';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import {
  useDeleteRecurringPatternMutation,
  useRecurringPatternsQuery,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import type { RecurringPattern } from '@/features/calendar-scheduling/types/recurring-availability';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';

export function RecurringAvailabilityTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.calendar.manage);

  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [formOpen, setFormOpen] = useState(false);
  const [editPattern, setEditPattern] = useState<RecurringPattern | undefined>();

  const { data, isPending, isError } = useRecurringPatternsQuery(shopId);
  const deleteMutation = useDeleteRecurringPatternMutation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
        {canManage ? (
          <Button
            onClick={() => {
              setEditPattern(undefined);
              setFormOpen(true);
            }}
          >
            {t('recurring.add')}
          </Button>
        ) : null}
      </div>
      <QuerySection
        isPending={isPending}
        isError={isError}
        isEmpty={Boolean(data && data.length === 0)}
        emptyMessage={t('recurring.empty')}
        skeleton={<Skeleton className="h-32 w-full" />}
      >
        <ul className="space-y-2">
          {(data ?? []).map((pattern) => (
            <li
              key={pattern.id}
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{pattern.label}</p>
                <p className="text-sm text-muted-foreground">
                  {pattern.schedule.map((s) => s.day).join(', ')}
                </p>
              </div>
              {canManage ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditPattern(pattern);
                      setFormOpen(true);
                    }}
                  >
                    {t('actions.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(pattern.id)}
                  >
                    {t('actions.delete')}
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </QuerySection>
      <RecurringPatternEditor
        open={formOpen}
        onOpenChange={setFormOpen}
        shopId={shopId}
        pattern={editPattern}
      />
    </div>
  );
}
