import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarLegend } from '@/features/calendar-scheduling/components/calendar/CalendarLegend';
import { CalendarView } from '@/features/calendar-scheduling/components/calendar/CalendarView';
import { ManualBookingSheet } from '@/features/calendar-scheduling/components/ManualBookingSheet';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import {
  useBlockedSlotsQuery,
  useCalendarEventsQuery,
  useDeleteBlockedSlotMutation,
  useDeleteHolidayMutation,
  useHolidaysQuery,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { buildShopCalendars } from '@/features/calendar-scheduling/lib/calendar-calendars';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';

export function ShopCalendarTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.calendar.manage);

  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [view, setView] = useState<CalendarViewMode>('week');
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState({
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });
  const [manualOpen, setManualOpen] = useState(false);
  const [manualStart, setManualStart] = useState<string | undefined>();

  const shopCalendars = useMemo(() => buildShopCalendars(), []);
  const deleteHolidayMutation = useDeleteHolidayMutation();
  const deleteBlockedMutation = useDeleteBlockedSlotMutation();

  const handleRangeChange = useCallback((start: string, end: string) => {
    setRange((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  const queryParams = useMemo(
    () => ({
      shopId,
      rangeStart: range.start,
      rangeEnd: range.end,
      kinds: ['booking', 'holiday', 'blocked'] as const,
    }),
    [shopId, range.start, range.end],
  );

  const { data, isPending, isFetching, isError } = useCalendarEventsQuery({
    ...queryParams,
    kinds: [...queryParams.kinds],
  });
  const { data: holidays } = useHolidaysQuery(shopId);
  const { data: blockedSlots } = useBlockedSlotsQuery(shopId);

  const handleDeleteEvent = useCallback(
    (event: ScheduleEvent): void => {
      if (!canManage) return;
      if (event.kind === 'holiday') {
        deleteHolidayMutation.mutate(event.meta.entityId);
      } else if (event.kind === 'blocked') {
        deleteBlockedMutation.mutate(event.meta.entityId);
      }
    },
    [canManage, deleteHolidayMutation, deleteBlockedMutation],
  );

  const openManualBookingWithoutPrefill = (): void => {
    if (!canManage) return;
    setManualStart(undefined);
    setManualOpen(true);
  };

  if (isError) {
    return <p className="text-sm text-destructive">{t('empty.calendar')}</p>;
  }

  return (
    <div className="space-y-4">
      <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
      <CalendarLegend calendars={shopCalendars} />
      <CalendarView
        events={data ?? []}
        calendars={shopCalendars}
        view={view}
        onViewChange={setView}
        date={date}
        onDateChange={setDate}
        onRangeChange={handleRangeChange}
        eventFormConfig={{
          mode: 'shop',
          shopId,
          holidays,
          blockedSlots,
        }}
        onDeleteEvent={handleDeleteEvent}
        readOnly={!canManage}
        isLoading={isPending || isFetching}
        emptyTitle={t('empty.calendar')}
        emptyDescription={canManage ? t('empty.calendarCta') : undefined}
        emptyActionLabel={canManage ? t('manualBooking.title') : undefined}
        onEmptyAction={canManage ? openManualBookingWithoutPrefill : undefined}
      />

      <ManualBookingSheet
        open={manualOpen}
        onOpenChange={setManualOpen}
        shopId={shopId}
        defaultStart={manualStart}
      />
    </div>
  );
}
