import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BlockedSlotsTab } from '@/features/calendar-scheduling/components/blocked-slots/BlockedSlotsTab';
import { BulkScheduleUpdateTab } from '@/features/calendar-scheduling/components/bulk/BulkScheduleUpdateTab';
import { HolidayCalendarTab } from '@/features/calendar-scheduling/components/holidays/HolidayCalendarTab';
import { RecurringAvailabilityTab } from '@/features/calendar-scheduling/components/recurring/RecurringAvailabilityTab';
import { ShopCalendarTab } from '@/features/calendar-scheduling/components/shop/ShopCalendarTab';
import { StaffCalendarTab } from '@/features/calendar-scheduling/components/staff/StaffCalendarTab';
import { WorkingHoursTab } from '@/features/calendar-scheduling/components/working-hours/WorkingHoursTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

type CalendarTab =
  | 'shop'
  | 'staff'
  | 'holidays'
  | 'blocked'
  | 'working-hours'
  | 'recurring'
  | 'bulk';

const TABS: CalendarTab[] = [
  'shop',
  'staff',
  'holidays',
  'blocked',
  'working-hours',
  'recurring',
  'bulk',
];

export function CalendarSchedulingTabs(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const [activeTab, setActiveTab] = useState<CalendarTab>('shop');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (TABS.includes(value as CalendarTab)) {
          setActiveTab(value as CalendarTab);
        }
      }}
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="shop" className="mt-4">
        {activeTab === 'shop' ? <ShopCalendarTab /> : null}
      </TabsContent>
      <TabsContent value="staff" className="mt-4">
        {activeTab === 'staff' ? <StaffCalendarTab /> : null}
      </TabsContent>
      <TabsContent value="holidays" className="mt-4">
        {activeTab === 'holidays' ? <HolidayCalendarTab /> : null}
      </TabsContent>
      <TabsContent value="blocked" className="mt-4">
        {activeTab === 'blocked' ? <BlockedSlotsTab /> : null}
      </TabsContent>
      <TabsContent value="working-hours" className="mt-4">
        {activeTab === 'working-hours' ? <WorkingHoursTab /> : null}
      </TabsContent>
      <TabsContent value="recurring" className="mt-4">
        {activeTab === 'recurring' ? <RecurringAvailabilityTab /> : null}
      </TabsContent>
      <TabsContent value="bulk" className="mt-4">
        {activeTab === 'bulk' ? <BulkScheduleUpdateTab /> : null}
      </TabsContent>
    </Tabs>
  );
}
