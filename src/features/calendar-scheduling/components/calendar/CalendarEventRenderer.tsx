import { format } from 'date-fns';
import type React from 'react';
import type { ViewType } from 'calendarkit-basic';

import { getEventColor } from '@/features/calendar-scheduling/lib/calendar-event-colors';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { cn } from '@/shared/lib/utils';

type CalendarEventRendererProps = {
  event: ScheduleEvent;
  view: ViewType;
  onClick?: () => void;
};

export function CalendarEventRenderer({
  event,
  view,
  onClick,
}: CalendarEventRendererProps): React.ReactElement {
  const color = getEventColor(event.kind, event.meta.bookingStatus);
  const isBlocked = event.kind === 'blocked';
  const isRecurring = event.kind === 'recurring';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded px-1.5 py-0.5 text-left text-xs text-white',
        isBlocked && 'border border-dashed border-slate-400 bg-slate-500',
        isRecurring && 'border border-dashed opacity-80',
      )}
      style={isBlocked ? undefined : { backgroundColor: color }}
    >
      <span className="block truncate font-medium">{event.title}</span>
      {view !== 'month' && !event.allDay ? (
        <span className="block truncate text-[10px] text-white/80">
          {format(new Date(event.start), 'HH:mm')} – {format(new Date(event.end), 'HH:mm')}
        </span>
      ) : null}
    </button>
  );
}
