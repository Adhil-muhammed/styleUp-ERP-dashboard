import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { StaffBookingsTab } from '@/features/staff-management/components/StaffBookingsTab';
import { StaffLeaveCalendarTab } from '@/features/staff-management/components/StaffLeaveCalendarTab';
import { StaffPerformanceTab } from '@/features/staff-management/components/StaffPerformanceTab';
import { StaffSkillsTab } from '@/features/staff-management/components/StaffSkillsTab';
import { StaffWorkingHoursTab } from '@/features/staff-management/components/StaffWorkingHoursTab';
import {
  STAFF_PROFILE_TABS,
  type StaffProfileTab,
} from '@/features/staff-management/types/staff-tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useResponsive } from '@/shared/hooks/use-responsive';
import { breakpoints } from '@/theme/responsive';

type StaffProfileTabsProps = {
  staffId: string;
};

function renderTabContent(tab: StaffProfileTab, staffId: string): React.ReactElement | null {
  switch (tab) {
    case 'skills':
      return <StaffSkillsTab staffId={staffId} />;
    case 'working-hours':
      return <StaffWorkingHoursTab staffId={staffId} />;
    case 'leave':
      return <StaffLeaveCalendarTab staffId={staffId} />;
    case 'bookings':
      return <StaffBookingsTab staffId={staffId} />;
    case 'performance':
      return <StaffPerformanceTab staffId={staffId} />;
    default:
      return null;
  }
}

function ProfileTabsView({ staffId }: StaffProfileTabsProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const [activeTab, setActiveTab] = useState<StaffProfileTab>('skills');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (STAFF_PROFILE_TABS.includes(value as StaffProfileTab)) {
          setActiveTab(value as StaffProfileTab);
        }
      }}
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        {STAFF_PROFILE_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {STAFF_PROFILE_TABS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Card>
            <CardContent className="pt-6">{renderTabContent(tab, staffId)}</CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ProfileAccordionView({ staffId }: StaffProfileTabsProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const [activeTab, setActiveTab] = useState<string>('skills');

  return (
    <Accordion type="single" collapsible value={activeTab} onValueChange={setActiveTab}>
      {STAFF_PROFILE_TABS.map((tab) => (
        <AccordionItem key={tab} value={tab}>
          <AccordionTrigger>{t(`tabs.${tab}`)}</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-4">{renderTabContent(tab, staffId)}</CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function StaffProfileTabs({ staffId }: StaffProfileTabsProps): React.ReactElement {
  const { width } = useResponsive();
  const useTabs = width >= breakpoints.lg;

  return useTabs ? (
    <ProfileTabsView staffId={staffId} />
  ) : (
    <ProfileAccordionView staffId={staffId} />
  );
}
