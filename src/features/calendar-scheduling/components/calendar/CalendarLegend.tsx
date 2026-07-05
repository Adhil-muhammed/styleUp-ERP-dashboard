import type React from 'react';
import { useTranslation } from 'react-i18next';

import { LEGEND_ITEMS } from '@/features/calendar-scheduling/lib/calendar-event-colors';
import type { CalendarFilter } from '@/features/calendar-scheduling/types/schedule-event';

type CalendarLegendProps = {
  calendars?: CalendarFilter[];
};

export function CalendarLegend({ calendars }: CalendarLegendProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const items = calendars ?? LEGEND_ITEMS.map((item) => ({ id: item.key, label: item.key, color: item.color }));

  return (
    <div className="flex flex-wrap gap-3 text-xs" data-testid="calendar-legend">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1.5">
          <span
            className="size-3 rounded-sm border"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">
            {calendars ? item.label : t(`legend.${item.label}`)}
          </span>
        </div>
      ))}
    </div>
  );
}
