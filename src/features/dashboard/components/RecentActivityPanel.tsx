import { useMemo, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { RecentActivityList } from '@/features/dashboard/components/RecentActivityList';
import { useDashboardActivityQuery } from '@/features/dashboard/hooks/use-dashboard-queries';
import type { ActivityTab } from '@/features/dashboard/types/dashboard-activity';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
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

const PAGE_SIZE = 10;

function ActivityTabSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full sm:h-14" />
      ))}
    </div>
  );
}

function ActivityTabPanel({ tab }: { tab: ActivityTab }): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const params = useMemo(
    () => ({ page: 1, pageSize: pagesLoaded * PAGE_SIZE }),
    [pagesLoaded],
  );
  const { data, isPending, isError, isFetching } = useDashboardActivityQuery(tab, params);

  const hasMore = data ? data.data.length < data.total : false;

  return (
    <DashboardSection
      isPending={isPending && pagesLoaded === 1}
      isError={isError}
      isEmpty={Boolean(data && data.data.length === 0)}
      emptyMessage={t('empty.activity')}
      skeleton={<ActivityTabSkeleton />}
    >
      {data && data.data.length > 0 ? (
        <div className="space-y-4">
          <RecentActivityList tab={tab} items={data.data} />
          {hasMore ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => setPagesLoaded((current) => current + 1)}
              >
                {t('activity.loadMore')}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </DashboardSection>
  );
}

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
            <ActivityTabPanel tab={tab} />
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
          {activeTab === tab ? <ActivityTabPanel key={tab} tab={tab} /> : null}
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
