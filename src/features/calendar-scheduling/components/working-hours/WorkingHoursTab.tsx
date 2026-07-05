import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import { ShopWorkingHoursEditor } from '@/features/merchant-management/components/ShopWorkingHoursEditor';
import { StaffWorkingHoursEditor } from '@/features/staff-management/components/StaffWorkingHoursTab';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export function WorkingHoursTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [staffId, setStaffId] = useState(
    staffFixture.find((s) => s.merchantId === shopId)?.id ?? '',
  );

  const staffOptions = staffFixture.filter((s) => s.merchantId === shopId);

  return (
    <div className="space-y-4">
      <ShopStaffSelector
        shopId={shopId}
        onShopChange={(id) => {
          setShopId(id);
          setStaffId(staffFixture.find((s) => s.merchantId === id)?.id ?? '');
        }}
      />
      <Tabs defaultValue="shop">
        <TabsList>
          <TabsTrigger value="shop">{t('workingHours.shop')}</TabsTrigger>
          <TabsTrigger value="staff">{t('workingHours.staff')}</TabsTrigger>
        </TabsList>
        <TabsContent value="shop" className="mt-4">
          <ShopWorkingHoursEditor merchantId={shopId} />
        </TabsContent>
        <TabsContent value="staff" className="mt-4 space-y-3">
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder={t('filters.staff')} />
            </SelectTrigger>
            <SelectContent>
              {staffOptions.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {staffId ? <StaffWorkingHoursEditor staffId={staffId} /> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
