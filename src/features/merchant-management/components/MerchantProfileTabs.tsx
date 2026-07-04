import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ShopAuditHistoryTab } from '@/features/merchant-management/components/ShopAuditHistoryTab';
import { ShopBookingsTab } from '@/features/merchant-management/components/ShopBookingsTab';
import { ShopGalleryTab } from '@/features/merchant-management/components/ShopGalleryTab';
import { ShopGeneralInfoTab } from '@/features/merchant-management/components/ShopGeneralInfoTab';
import { ShopPackagesTab } from '@/features/merchant-management/components/ShopPackagesTab';
import { ShopPerformanceTab } from '@/features/merchant-management/components/ShopPerformanceTab';
import { ShopReviewsTab } from '@/features/merchant-management/components/ShopReviewsTab';
import { ShopServicesTab } from '@/features/merchant-management/components/ShopServicesTab';
import { ShopStaffTab } from '@/features/merchant-management/components/ShopStaffTab';
import { ShopWorkingHoursTab } from '@/features/merchant-management/components/ShopWorkingHoursTab';
import {
  SHOP_PROFILE_TABS,
  type ShopProfileTab,
} from '@/features/merchant-management/types/shop-tabs';
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

function renderTabContent(tab: ShopProfileTab, merchantId: string): React.ReactElement | null {
  switch (tab) {
    case 'general-information':
      return <ShopGeneralInfoTab merchantId={merchantId} />;
    case 'working-hours':
      return <ShopWorkingHoursTab merchantId={merchantId} />;
    case 'gallery':
      return <ShopGalleryTab merchantId={merchantId} />;
    case 'services':
      return <ShopServicesTab merchantId={merchantId} />;
    case 'packages':
      return <ShopPackagesTab merchantId={merchantId} />;
    case 'staff':
      return <ShopStaffTab merchantId={merchantId} />;
    case 'bookings':
      return <ShopBookingsTab merchantId={merchantId} />;
    case 'reviews':
      return <ShopReviewsTab merchantId={merchantId} />;
    case 'performance':
      return <ShopPerformanceTab merchantId={merchantId} />;
    case 'audit-history':
      return <ShopAuditHistoryTab merchantId={merchantId} />;
    default:
      return null;
  }
}

function ProfileTabsView({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const [activeTab, setActiveTab] = useState<ShopProfileTab>('general-information');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (SHOP_PROFILE_TABS.includes(value as ShopProfileTab)) {
          setActiveTab(value as ShopProfileTab);
        }
      }}
    >
      <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
        {SHOP_PROFILE_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="px-3 text-sm">
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {SHOP_PROFILE_TABS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          {activeTab === tab ? renderTabContent(tab, merchantId) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ProfileAccordionView({ merchantId }: { merchantId: string }): React.ReactElement {
  const { t } = useTranslation('merchant-management');

  return (
    <Accordion type="single" collapsible defaultValue="general-information" className="w-full">
      {SHOP_PROFILE_TABS.map((tab) => (
        <AccordionItem key={tab} value={tab}>
          <AccordionTrigger className="text-sm font-medium">{t(`tabs.${tab}`)}</AccordionTrigger>
          <AccordionContent>{renderTabContent(tab, merchantId)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function MerchantProfileTabs({ merchantId }: { merchantId: string }): React.ReactElement {
  const { width } = useResponsive();
  const showTabs = width >= breakpoints.lg;

  return (
    <Card className="overflow-hidden" data-testid="merchant-profile-tabs">
      <CardContent className="pt-6">
        {showTabs ? (
          <ProfileTabsView merchantId={merchantId} />
        ) : (
          <ProfileAccordionView merchantId={merchantId} />
        )}
      </CardContent>
    </Card>
  );
}
