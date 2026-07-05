import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarSchedulingTabs } from '@/features/calendar-scheduling/components/CalendarSchedulingTabs';
import { layout, typography } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export function CalendarSchedulingPage(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');

  return (
    <div className={layout.pageStack} data-testid="calendar-scheduling-page">
      <header className="space-y-1">
        <h1 className={cn(typography.sectionTitle, 'font-semibold tracking-tight sm:text-2xl')}>
          {t('page.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </header>
      <CalendarSchedulingTabs />
    </div>
  );
}
