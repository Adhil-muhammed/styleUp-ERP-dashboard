import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarLegend } from '@/features/calendar-scheduling/components/calendar/CalendarLegend';
import { CalendarView } from '@/features/calendar-scheduling/components/calendar/CalendarView';
import { HolidayConflictDialog } from '@/features/calendar-scheduling/components/holidays/HolidayConflictDialog';
import { HolidayFormSheet } from '@/features/calendar-scheduling/components/holidays/HolidayFormSheet';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import {
  useCalendarEventsQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
  useHolidaysQuery,
  checkHolidayConflicts,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { buildHolidayCalendars } from '@/features/calendar-scheduling/lib/calendar-calendars';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type { Holiday } from '@/features/calendar-scheduling/types/holiday';
import type { HolidayConflict } from '@/features/calendar-scheduling/types/holiday';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { Button } from '@/shared/components/ui/button';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export function HolidayCalendarTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.calendar.manage);

  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [view, setView] = useState<CalendarViewMode>('week');
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState({ start: new Date().toISOString(), end: new Date().toISOString() });
  const [formOpen, setFormOpen] = useState(false);
  const [editHoliday, setEditHoliday] = useState<Holiday | undefined>();
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflicts, setConflicts] = useState<HolidayConflict[]>([]);
  const [pendingHoliday, setPendingHoliday] = useState<Holiday | null>(null);

  const holidayCalendars = useMemo(() => buildHolidayCalendars(), []);
  const deleteHolidayMutation = useDeleteHolidayMutation();

  const handleRangeChange = useCallback((start: string, end: string) => {
    setRange((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  const { data: holidays, isPending: listPending } = useHolidaysQuery(shopId);
  const { data: events, isPending: calPending, isFetching, isError } = useCalendarEventsQuery({
    shopId,
    rangeStart: range.start,
    rangeEnd: range.end,
    kinds: ['holiday', 'booking'],
  });
  const createMutation = useCreateHolidayMutation();

  const handleSaved = async (holiday: Holiday): Promise<void> => {
    const found = await checkHolidayConflicts(holiday.shopId, holiday.startDate, holiday.endDate);
    if (found.length > 0) {
      setConflicts(found);
      setPendingHoliday(holiday);
      setConflictOpen(true);
    }
  };

  const handleDeleteEvent = useCallback(
    (event: ScheduleEvent): void => {
      if (!canManage || event.kind !== 'holiday') return;
      deleteHolidayMutation.mutate(event.meta.entityId);
    },
    [canManage, deleteHolidayMutation],
  );

  const openHolidayFormWithoutPrefill = (): void => {
    if (!canManage) return;
    setEditHoliday(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
        {canManage ? (
          <Button onClick={openHolidayFormWithoutPrefill}>
            {t('holidays.add')}
          </Button>
        ) : null}
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">{t('holidays.viewCalendar')}</TabsTrigger>
          <TabsTrigger value="list">{t('holidays.viewList')}</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4 space-y-4">
          <CalendarLegend calendars={holidayCalendars} />
          {isError ? (
            <p className="text-sm text-destructive">{t('empty.calendar')}</p>
          ) : (
            <CalendarView
              events={events ?? []}
              calendars={holidayCalendars}
              view={view}
              onViewChange={setView}
              date={date}
              onDateChange={setDate}
              onRangeChange={handleRangeChange}
              eventFormConfig={{
                mode: 'holiday',
                shopId,
                holidays,
                onHolidaySaved: handleSaved,
              }}
              onDeleteEvent={handleDeleteEvent}
              readOnly={!canManage}
              isLoading={calPending || isFetching}
              emptyTitle={t('holidays.empty')}
              emptyActionLabel={canManage ? t('holidays.add') : undefined}
              onEmptyAction={canManage ? openHolidayFormWithoutPrefill : undefined}
            />
          )}
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          {listPending ? (
            <p className="text-sm text-muted-foreground">{t('empty.loading')}</p>
          ) : (
            <ul className="space-y-2">
              {(holidays ?? []).map((holiday) => (
                <li
                  key={holiday.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{holiday.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(holiday.startDate), 'dd MMM yyyy')} –{' '}
                      {format(new Date(holiday.endDate), 'dd MMM yyyy')}
                      {holiday.recurringYearly ? ` · ${t('holidays.recurringYearly')}` : ''}
                    </p>
                  </div>
                  {canManage ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditHoliday(holiday);
                          setFormOpen(true);
                        }}
                      >
                        {t('actions.edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteHolidayMutation.mutate(holiday.id)}
                      >
                        {t('actions.delete')}
                      </Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <HolidayFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        shopId={shopId}
        holiday={editHoliday}
        onSaved={handleSaved}
      />
      <HolidayConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        conflicts={conflicts}
        onConfirm={() => {
          if (pendingHoliday && !editHoliday) {
            createMutation.mutate(pendingHoliday, { onSuccess: () => setConflictOpen(false) });
          } else {
            setConflictOpen(false);
          }
        }}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
