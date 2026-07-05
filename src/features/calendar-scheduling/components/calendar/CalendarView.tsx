import { BasicScheduler } from 'calendarkit-basic';
import type { ViewType } from 'calendarkit-basic';
import { useEffect, useMemo, useState } from 'react';
import type React from 'react';

import { findScheduleEvent } from '@/features/calendar-scheduling/lib/adapters/from-kit-event';
import { toKitEvents } from '@/features/calendar-scheduling/lib/adapters/to-kit-event';
import { getVisibleRange, CALENDAR_WEEK_STARTS_ON } from '@/features/calendar-scheduling/lib/calendar-date-range';
import { getCalendarKitTheme } from '@/features/calendar-scheduling/lib/calendar-theme';
import { CalendarEventRenderer } from '@/features/calendar-scheduling/components/calendar/CalendarEventRenderer';
import type { CalendarViewMode } from '@/features/calendar-scheduling/types/calendar-event';
import type { CalendarFilter, ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { Button } from '@/shared/components/ui/button';
import { EmptyState } from '@/shared/components/empty-state/EmptyState';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { useTheme } from '@/shared/lib/theme-provider';
import { breakpoints } from '@/theme/responsive';

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
  onEventClick?: (event: ScheduleEvent) => void;
  onEventCreate?: (initialDate: Date) => void;
  onCalendarToggle?: (calendarId: string, active: boolean) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  calendarIdMode?: 'shop' | 'staff';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

export function CalendarView({
  events,
  calendars,
  view,
  onViewChange,
  date,
  onDateChange,
  onRangeChange,
  onEventClick,
  onEventCreate,
  onCalendarToggle,
  readOnly = false,
  isLoading = false,
  calendarIdMode = 'shop',
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
}: CalendarViewProps): React.ReactElement {
  const { width } = useResponsive();
  const { theme } = useTheme();
  const isMobile = width < breakpoints.md;
  const effectiveView: ViewType = isMobile && view !== 'day' ? 'day' : view;
  const [internalDate, setInternalDate] = useState(date);

  useEffect(() => {
    setInternalDate(date);
  }, [date]);

  useEffect(() => {
    const range = getVisibleRange(internalDate, effectiveView);
    onRangeChange(range.start, range.end);
  }, [internalDate, effectiveView, onRangeChange]);

  const kitEvents = useMemo(
    () => toKitEvents(events, calendarIdMode),
    [events, calendarIdMode],
  );

  const kitTheme = useMemo(() => getCalendarKitTheme(theme === 'dark'), [theme]);

  const showEmpty =
    !isLoading && events.length === 0 && emptyTitle;

  if (showEmpty) {
    return (
      <div className="space-y-3">
        <EmptyState title={emptyTitle ?? ''} description={emptyDescription} />
        {emptyActionLabel && onEmptyAction ? (
          <Button type="button" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="calendar-view-host" data-testid="calendar-view">
      <BasicScheduler
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
        onEventClick={(kitEvent) => {
          const domain = findScheduleEvent(events, kitEvent.id);
          if (domain && onEventClick) onEventClick(domain);
        }}
        onEventCreate={(partial) => {
          if (partial.start && onEventCreate) onEventCreate(partial.start);
        }}
        onCalendarToggle={onCalendarToggle}
        readOnly={readOnly}
        isLoading={isLoading}
        theme={kitTheme}
        isDarkMode={theme === 'dark'}
        renderEvent={({ event: kitEvent, view: currentView, onClick }) => {
          const domain = findScheduleEvent(events, kitEvent.id);
          if (!domain) return null;
          return (
            <CalendarEventRenderer
              event={domain}
              view={currentView}
              onClick={onClick}
            />
          );
        }}
      />
    </div>
  );
}
