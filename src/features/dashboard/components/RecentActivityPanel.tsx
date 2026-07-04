import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { RecentActivityTable } from '@/features/dashboard/components/RecentActivityTable';
import type { ActivityTab } from '@/features/dashboard/types/dashboard-activity';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { breakpoints } from '@/theme/responsive';

const ACTIVITY_TABS: ActivityTab[] = [
  'bookings',
  'registrations',
  'reviews',
  'refunds',
  'alerts',
];

function ActivityAccordionView(): React.ReactElement {
  const { t } = useTranslation('dashboard');

  return (
    <Accordion type="single" collapsible defaultValue="bookings" className="w-full">
      {ACTIVITY_TABS.map((tab) => (
        <AccordionItem key={tab} value={tab}>
          <AccordionTrigger className="text-sm font-medium">
            {t(`activity.tabs.${tab}`)}
          </AccordionTrigger>
          <AccordionContent>
            <RecentActivityTable tab={tab} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ActivityTabsView(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const [activeTab, setActiveTab] = useState<ActivityTab>('bookings');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (ACTIVITY_TABS.includes(value as ActivityTab)) {
          setActiveTab(value as ActivityTab);
        }
      }}
    >
      <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
        {ACTIVITY_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="px-3 text-sm">
            {t(`activity.tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {ACTIVITY_TABS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          {activeTab === tab ? <RecentActivityTable key={tab} tab={tab} /> : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function RecentActivityPanel(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { width } = useResponsive();
  const showTabs = width >= breakpoints.lg;

  return (
    <Card className="overflow-hidden" data-testid="recent-activity-panel">
      <CardHeader>
        <CardTitle>{t('activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {showTabs ? <ActivityTabsView /> : <ActivityAccordionView />}
      </CardContent>
    </Card>
  );
}
