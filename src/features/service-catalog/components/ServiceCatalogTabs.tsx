import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryTable } from '@/features/service-catalog/components/CategoryTable';
import { ServiceVariantTable } from '@/features/service-catalog/components/ServiceVariantTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

type CatalogTab = 'categories' | 'variants';

export function ServiceCatalogTabs(): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const [activeTab, setActiveTab] = useState<CatalogTab>('categories');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (value === 'categories' || value === 'variants') {
          setActiveTab(value);
        }
      }}
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="categories">{t('tabs.categories')}</TabsTrigger>
        <TabsTrigger value="variants">{t('tabs.variants')}</TabsTrigger>
      </TabsList>
      <TabsContent value="categories" className="mt-4">
        {activeTab === 'categories' ? <CategoryTable /> : null}
      </TabsContent>
      <TabsContent value="variants" className="mt-4">
        {activeTab === 'variants' ? <ServiceVariantTable /> : null}
      </TabsContent>
    </Tabs>
  );
}
