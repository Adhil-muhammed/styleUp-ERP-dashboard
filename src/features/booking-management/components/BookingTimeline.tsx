import { format } from 'date-fns';
import {
  CalendarClock,
  CheckCircle2,
  CircleDot,
  UserX,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type {
  BookingTimelineEvent,
  BookingTimelineEventType,
} from '@/features/booking-management/types/booking-detail';

function eventIcon(type: BookingTimelineEventType): React.ReactElement {
  switch (type) {
    case 'created':
      return <CircleDot className="size-4" />;
    case 'confirmed':
      return <CheckCircle2 className="size-4" />;
    case 'rescheduled':
      return <CalendarClock className="size-4" />;
    case 'completed':
      return <CheckCircle2 className="size-4" />;
    case 'cancelled':
      return <XCircle className="size-4" />;
    case 'no_show':
      return <UserX className="size-4" />;
  }
}

type BookingTimelineProps = {
  events: BookingTimelineEvent[];
};

export function BookingTimeline({ events }: BookingTimelineProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  return (
    <ol className="relative space-y-4 border-l border-border pl-4">
      {events.map((event, index) => (
        <li key={`${event.type}-${event.at}-${index}`} className="relative">
          <span className="absolute -left-[1.35rem] flex size-6 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
            {eventIcon(event.type)}
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{t(`timeline.${event.type}`)}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(event.at), 'dd MMM yyyy, HH:mm')}
            </p>
            {event.note ? (
              <p className="text-xs text-muted-foreground">{event.note}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
