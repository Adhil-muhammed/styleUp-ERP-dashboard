import { BasicScheduler } from 'calendarkit-basic';
import type { ViewType } from 'calendarkit-basic';
import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';

import {
  CalendarEventFormRouter,
  type CalendarEventFormConfig,
} from '@/features/calendar-scheduling/components/calendar/CalendarEventFormRouter';
import { CalendarEventRenderer } from '@/features/calendar-scheduling/components/calendar/CalendarEventRenderer';
import { findScheduleEvent } from '@/features/calendar-scheduling/lib/adapters/from-kit-event';
import { toKitEvents } from '@/features/calendar-scheduling/lib/adapters/to-kit-event';
import {
  getVisibleRange,
  CALENDAR_WEEK_STARTS_ON,
} from '@/features/calendar-scheduling/lib/calendar-date-range';
import { getCalendarKitTheme } from '@/features/calendar-scheduling/lib/calendar-theme';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type {
  CalendarFilter,
  ScheduleEvent,
} from '@/features/calendar-scheduling/types/schedule-event';
import '@/features/calendar-scheduling/styles/calendar-kit.css';
import { Button } from '@/shared/components/ui/button';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { useTheme } from '@/shared/lib/theme-provider';
import { cn } from '@/shared/lib/utils';
import { calendar, calendarClasses } from '@/theme/responsive';

/**
 * Single import boundary for calendarkit-basic.
 * Drag-drop, resource/timeline, and agenda views require CalendarKit Pro — not available in Basic.
 */
export type CalendarViewProps = {
  events: ScheduleEvent[];
  calendars?: CalendarFilter[];
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  onRangeChange: (start: string, end: string) => void;
  eventFormConfig: CalendarEventFormConfig;
  onDeleteEvent?: (event: ScheduleEvent) => void;
  onCalendarToggle?: (calendarId: string, active: boolean) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  calendarIdMode?: 'shop' | 'staff';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

function getCalendarHostHeight(isMobile: boolean, isTablet: boolean): number {
  if (isMobile) return calendar.heightMobile;
  if (isTablet) return calendar.heightTablet;
  return calendar.heightDesktop;
}

export function CalendarView({
  events,
  calendars,
  view,
  onViewChange,
  date,
  onDateChange,
  onRangeChange,
  eventFormConfig,
  onDeleteEvent,
  onCalendarToggle,
  readOnly = false,
  isLoading = false,
  calendarIdMode = 'shop',
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
}: CalendarViewProps): React.ReactElement {
  const { isMobile, isTablet } = useResponsive();
  const { theme } = useTheme();
  const effectiveView: ViewType = view;
  const hostHeight = getCalendarHostHeight(isMobile, isTablet);
  const [internalDate, setInternalDate] = useState(date);
  const onRangeChangeRef = useRef(onRangeChange);
  const onDeleteEventRef = useRef(onDeleteEvent);
  const lastRangeRef = useRef<{ start: string; end: string } | null>(null);

  onRangeChangeRef.current = onRangeChange;
  onDeleteEventRef.current = onDeleteEvent;

  useEffect(() => {
    setInternalDate(date);
  }, [date]);

  useEffect(() => {
    const range = getVisibleRange(internalDate, effectiveView);
    if (lastRangeRef.current?.start === range.start && lastRangeRef.current?.end === range.end) {
      return;
    }
    lastRangeRef.current = range;
    onRangeChangeRef.current(range.start, range.end);
  }, [internalDate, effectiveView]);

  const kitEvents = useMemo(() => toKitEvents(events, calendarIdMode), [events, calendarIdMode]);

  const kitTheme = useMemo(() => getCalendarKitTheme(theme === 'dark'), [theme]);

  const showEmptyBanner = !isLoading && events.length === 0 && emptyTitle;

  return (
    <div
      className={cn(calendarClasses.host, 'calendar-view-host space-y-3')}
      style={{ height: hostHeight }}
      data-testid="calendar-view"
    >
      {showEmptyBanner ? (
        <div className="flex shrink-0 flex-col gap-3 rounded-lg border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{emptyTitle}</p>
            {emptyDescription ? (
              <p className="text-sm text-muted-foreground">{emptyDescription}</p>
            ) : null}
          </div>
          {emptyActionLabel && onEmptyAction ? (
            <Button type="button" variant="outline" onClick={onEmptyAction}>
              {emptyActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn('min-h-0 flex-1 overflow-x-auto', calendarClasses.scheduler)}
        style={{ minHeight: calendar.heightMobile }}
      >
        <BasicScheduler
          className="h-full"
          events={kitEvents}
          calendars={calendars}
          view={effectiveView}
          onViewChange={onViewChange}
          date={internalDate}
          onDateChange={(nextDate) => {
            setInternalDate(nextDate);
            onDateChange(nextDate);
          }}
          weekStartsOn={CALENDAR_WEEK_STARTS_ON}
          onEventDelete={(kitEventId) => {
            const domain = findScheduleEvent(events, kitEventId);
            if (domain) onDeleteEventRef.current?.(domain);
          }}
          renderEventForm={({ isOpen, onClose, event, initialDate, onSave, onDelete }) => (
            <CalendarEventFormRouter
              isOpen={isOpen}
              onClose={onClose}
              kitEvent={event}
              initialDate={initialDate}
              onSave={onSave}
              onDelete={onDelete}
              readOnly={readOnly}
              events={events}
              config={eventFormConfig}
            />
          )}
          onCalendarToggle={onCalendarToggle}
          readOnly={readOnly}
          isLoading={isLoading}
          theme={kitTheme}
          isDarkMode={theme === 'dark'}
          renderEvent={({ event: kitEvent, view: currentView, onClick }) => {
            const domain = findScheduleEvent(events, kitEvent.id);
            if (!domain) return null;
            return <CalendarEventRenderer event={domain} view={currentView} onClick={onClick} />;
          }}
        />
      </div>
    </div>
  );
}
