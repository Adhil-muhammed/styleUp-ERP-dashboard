import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useStaffLeaveQuery } from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffLeaveRequest } from '@/features/staff-management/types/staff-tabs';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

function leaveStatusVariant(
  status: StaffLeaveRequest['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'approved') return 'default';
  if (status === 'pending') return 'outline';
  return 'destructive';
}

function isDateInLeave(date: Date, leave: StaffLeaveRequest): boolean {
  const start = parseISO(leave.startDate);
  const end = parseISO(leave.endDate);
  return date >= start && date <= end;
}

type StaffLeaveCalendarTabProps = {
  staffId: string;
};

export function StaffLeaveCalendarTab({ staffId }: StaffLeaveCalendarTabProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const { data, isPending, isError } = useStaffLeaveQuery(staffId);
  const [month] = useState(() => startOfMonth(new Date()));

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }),
    [month],
  );

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-64 w-full" />}
      isEmpty={!data?.length}
      emptyMessage={t('empty.leave')}
    >
      {data ? (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium">{t('leave.calendarTitle')}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                <div key={label} className="py-1 font-medium text-muted-foreground">
                  {label}
                </div>
              ))}
              {Array.from({ length: days[0]?.getDay() ?? 0 }).map((_, index) => (
                <div key={`pad-${index}`} />
              ))}
              {days.map((day) => {
                const onLeave = data.some((leave) => isDateInLeave(day, leave));
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'rounded-md border py-2',
                      onLeave && 'border-primary/40 bg-primary/10 font-medium',
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('leave.requestsTitle')}</h3>
            {data.map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {format(parseISO(leave.startDate), 'dd MMM yyyy')} –{' '}
                    {format(parseISO(leave.endDate), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                </div>
                <Badge variant={leaveStatusVariant(leave.status)}>
                  {t(`leave.status.${leave.status}`)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </QuerySection>
  );
}