import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomerAuditLogsTab } from '@/features/user-management/components/CustomerAuditLogsTab';
import { CustomerBookingsTab } from '@/features/user-management/components/CustomerBookingsTab';
import { CustomerLoyaltyTab } from '@/features/user-management/components/CustomerLoyaltyTab';
import { CustomerNotificationsTab } from '@/features/user-management/components/CustomerNotificationsTab';
import { CustomerOverviewTab } from '@/features/user-management/components/CustomerOverviewTab';
import { CustomerPaymentsTab } from '@/features/user-management/components/CustomerPaymentsTab';
import { CustomerReviewsTab } from '@/features/user-management/components/CustomerReviewsTab';
import {
  CUSTOMER_PROFILE_TABS,
  type CustomerProfileTab,
} from '@/features/user-management/types/customer-tabs';
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

type CustomerProfileTabsProps = {
  customerId: string;
};

function renderTabContent(tab: CustomerProfileTab, customerId: string): React.ReactElement | null {
  switch (tab) {
    case 'overview':
      return <CustomerOverviewTab customerId={customerId} />;
    case 'bookings':
      return <CustomerBookingsTab customerId={customerId} />;
    case 'payments':
      return <CustomerPaymentsTab customerId={customerId} />;
    case 'reviews':
      return <CustomerReviewsTab customerId={customerId} />;
    case 'notifications':
      return <CustomerNotificationsTab customerId={customerId} />;
    case 'loyalty':
      return <CustomerLoyaltyTab customerId={customerId} />;
    case 'audit-logs':
      return <CustomerAuditLogsTab customerId={customerId} />;
    default:
      return null;
  }
}

function ProfileTabsView({ customerId }: CustomerProfileTabsProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const [activeTab, setActiveTab] = useState<CustomerProfileTab>('overview');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (CUSTOMER_PROFILE_TABS.includes(value as CustomerProfileTab)) {
          setActiveTab(value as CustomerProfileTab);
        }
      }}
    >
      <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
        {CUSTOMER_PROFILE_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="px-3 text-sm">
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {CUSTOMER_PROFILE_TABS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          {activeTab === tab ? renderTabContent(tab, customerId) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ProfileAccordionView({ customerId }: CustomerProfileTabsProps): React.ReactElement {
  const { t } = useTranslation('user-management');

  return (
    <Accordion type="single" collapsible defaultValue="overview" className="w-full">
      {CUSTOMER_PROFILE_TABS.map((tab) => (
        <AccordionItem key={tab} value={tab}>
          <AccordionTrigger className="text-sm font-medium">{t(`tabs.${tab}`)}</AccordionTrigger>
          <AccordionContent>{renderTabContent(tab, customerId)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function CustomerProfileTabs({ customerId }: CustomerProfileTabsProps): React.ReactElement {
  const { width } = useResponsive();
  const showTabs = width >= breakpoints.lg;

  return (
    <Card className="overflow-hidden" data-testid="customer-profile-tabs">
      <CardContent className="pt-6">
        {showTabs ? (
          <ProfileTabsView customerId={customerId} />
        ) : (
          <ProfileAccordionView customerId={customerId} />
        )}
      </CardContent>
    </Card>
  );
}
