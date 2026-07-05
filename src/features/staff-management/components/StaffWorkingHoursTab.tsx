import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useStaffWorkingHoursQuery,
  useUpdateStaffWorkingHoursMutation,
} from '@/features/staff-management/hooks/use-staff-management-queries';
import {
  DAYS_OF_WEEK,
  type DayOfWeek,
  type WorkingHours,
} from '@/features/staff-management/types/staff-working-hours';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Switch } from '@/shared/components/ui/switch';
import { PERMISSIONS } from '@/shared/config/permissions';
import { Can } from '@/shared/lib/casl-context';

type StaffWorkingHoursFormProps = {
  staffId: string;
  initialHours: WorkingHours;
};

function StaffWorkingHoursForm({
  staffId,
  initialHours,
}: StaffWorkingHoursFormProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const updateMutation = useUpdateStaffWorkingHoursMutation(staffId);
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
      <Can I="manage" a={PERMISSIONS.staff.manage}>
        <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate(hours)}>
          {t('form.save')}
        </Button>
      </Can>
    </div>
  );
}

type StaffWorkingHoursEditorProps = {
  staffId: string;
};

export function StaffWorkingHoursEditor({
  staffId,
}: StaffWorkingHoursEditorProps): React.ReactElement {
  const { data, isPending, isError } = useStaffWorkingHoursQuery(staffId);

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-48 w-full" />}
    >
      {data ? (
        <StaffWorkingHoursForm
          key={`${staffId}-${JSON.stringify(data)}`}
          staffId={staffId}
          initialHours={data}
        />
      ) : null}
    </QuerySection>
  );
}

type StaffWorkingHoursTabProps = {
  staffId: string;
};

export function StaffWorkingHoursTab({ staffId }: StaffWorkingHoursTabProps): React.ReactElement {
  return <StaffWorkingHoursEditor staffId={staffId} />;
}
