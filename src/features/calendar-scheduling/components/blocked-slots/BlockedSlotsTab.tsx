import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BlockedSlotFormSheet } from '@/features/calendar-scheduling/components/blocked-slots/BlockedSlotFormSheet';
import { BlockedSlotsPanel } from '@/features/calendar-scheduling/components/blocked-slots/BlockedSlotsPanel';
import { CalendarLegend } from '@/features/calendar-scheduling/components/calendar/CalendarLegend';
import { CalendarView } from '@/features/calendar-scheduling/components/calendar/CalendarView';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import {
  useBlockedSlotsQuery,
  useCalendarEventsQuery,
  useDeleteBlockedSlotMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { buildBlockedCalendars } from '@/features/calendar-scheduling/lib/calendar-calendars';
import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { Button } from '@/shared/components/ui/button';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';

export function BlockedSlotsTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.calendar.manage);

  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [view, setView] = useState<CalendarViewMode>('week');
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState({ start: new Date().toISOString(), end: new Date().toISOString() });
  const [formOpen, setFormOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<BlockedSlot | undefined>();
  const [selectStart, setSelectStart] = useState<string | undefined>();
  const [selectEnd, setSelectEnd] = useState<string | undefined>();

  const blockedCalendars = useMemo(() => buildBlockedCalendars(), []);

  const handleRangeChange = useCallback((start: string, end: string) => {
    setRange((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  const queryParams = { shopId, rangeStart: range.start, rangeEnd: range.end, kinds: ['blocked'] as const };
  const { data: events, isPending, isFetching, isError } = useCalendarEventsQuery({
    ...queryParams,
    kinds: ['blocked'],
  });
  const { data: slots, isPending: slotsPending } = useBlockedSlotsQuery(shopId);
  const deleteMutation = useDeleteBlockedSlotMutation();

  const openCreateForm = (start: Date, end?: Date): void => {
    if (!canManage) return;
    setSelectStart(start.toISOString());
    setSelectEnd(end?.toISOString() ?? new Date(start.getTime() + 60 * 60 * 1000).toISOString());
    setEditSlot(undefined);
    setFormOpen(true);
  };

  const handleEventClick = (event: ScheduleEvent): void => {
    if (event.kind !== 'blocked' || !canManage) return;
    const slot = slots?.find((s) => s.id === event.meta.entityId);
    if (slot) {
      setEditSlot(slot);
      setFormOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
        {canManage ? (
          <Button
            onClick={() => {
              setEditSlot(undefined);
              setSelectStart(undefined);
              setSelectEnd(undefined);
              setFormOpen(true);
            }}
          >
            {t('blocked.add')}
          </Button>
        ) : null}
      </div>
      <CalendarLegend calendars={blockedCalendars} />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        {isError ? (
          <p className="text-sm text-destructive">{t('empty.calendar')}</p>
        ) : (
          <CalendarView
            events={events ?? []}
            calendars={blockedCalendars}
            view={view}
            onViewChange={setView}
            date={date}
            onDateChange={setDate}
            onRangeChange={handleRangeChange}
            onEventClick={handleEventClick}
            // Inline callback is safe: consumer does not use this in a useEffect dep array.
            // If that changes, stabilize with useCallback — see .cursor/rules/095-react-effect-hygiene.mdc
            onEventCreate={(initialDate) => openCreateForm(initialDate)}
            readOnly={!canManage}
            isLoading={isPending || isFetching}
            emptyTitle={t('blocked.empty')}
            emptyActionLabel={canManage ? t('blocked.add') : undefined}
            // Inline callback is safe: consumer does not use this in a useEffect dep array.
            // If that changes, stabilize with useCallback — see .cursor/rules/095-react-effect-hygiene.mdc
            onEmptyAction={canManage ? () => openCreateForm(new Date()) : undefined}
          />
        )}
        <div>
          {slotsPending ? (
            <p className="text-sm text-muted-foreground">{t('empty.loading')}</p>
          ) : (
            <BlockedSlotsPanel
              slots={slots ?? []}
              canManage={canManage}
              onEdit={(slot) => {
                setEditSlot(slot);
                setFormOpen(true);
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>
      </div>
      <BlockedSlotFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        shopId={shopId}
        slot={editSlot}
        defaultStart={selectStart}
        defaultEnd={selectEnd}
      />
    </div>
  );
}
