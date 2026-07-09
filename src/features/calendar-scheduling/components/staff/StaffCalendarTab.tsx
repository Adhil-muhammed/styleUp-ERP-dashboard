import { useCallback, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarLegend } from '@/features/calendar-scheduling/components/calendar/CalendarLegend';
import { CalendarView } from '@/features/calendar-scheduling/components/calendar/CalendarView';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import { useCalendarEventsQuery } from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { buildStaffCalendars } from '@/features/calendar-scheduling/lib/calendar-calendars';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type { CalendarFilter, ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { BookingDetailsSheet } from '@/features/booking-management/components/BookingDetailsSheet';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';

/**
 * Staff scheduling uses week view + per-staff calendar filters.
 * Resource/timeline side-by-side view requires CalendarKit Pro (not in Basic).
 * Reschedule bookings via BookingDetailsSheet → RescheduleDialog (no drag-drop in Basic).
 */
export function StaffCalendarTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.calendar.manage);

  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [view, setView] = useState<CalendarViewMode>('week');
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState({ start: new Date().toISOString(), end: new Date().toISOString() });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const staffOptions = useMemo(
    () => staffFixture.filter((s) => s.merchantId === shopId).slice(0, 4),
    [shopId],
  );

  const [calendars, setCalendars] = useState<CalendarFilter[]>(() =>
    buildStaffCalendars(staffOptions),
  );

  useEffect(() => {
    setCalendars(buildStaffCalendars(staffOptions));
  }, [staffOptions]);

  const activeStaffIds = useMemo(
    () => calendars.filter((c) => c.active !== false).map((c) => c.id),
    [calendars],
  );

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
      staffIds: activeStaffIds,
    }),
    [shopId, range.start, range.end, activeStaffIds],
  );

  const { data, isPending, isFetching, isError } = useCalendarEventsQuery(queryParams);

  const handleEventClick = (event: ScheduleEvent): void => {
    if (event.kind === 'booking') {
      setSelectedBookingId(event.meta.entityId);
      setDetailsOpen(true);
    }
  };

  const handleCalendarToggle = (calendarId: string, active: boolean): void => {
    setCalendars((current) =>
      current.map((cal) => (cal.id === calendarId ? { ...cal, active } : cal)),
    );
  };

  if (isError) {
    return <p className="text-sm text-destructive">{t('empty.calendar')}</p>;
  }

  return (
    <div className="space-y-4">
      <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
      <p className="text-xs text-muted-foreground">{t('staff.resourceViewNote')}</p>
      <CalendarLegend calendars={calendars} />
      <CalendarView
        events={data ?? []}
        calendars={calendars}
        view={view}
        onViewChange={setView}
        date={date}
        onDateChange={setDate}
        onRangeChange={handleRangeChange}
        onEventClick={handleEventClick}
        onCalendarToggle={handleCalendarToggle}
        readOnly={!canManage}
        isLoading={isPending || isFetching}
        calendarIdMode="staff"
        emptyTitle={t('empty.staffCalendar')}
        emptyDescription={t('empty.staffCalendarHint')}
      />

      <BookingDetailsSheet
        bookingId={selectedBookingId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
