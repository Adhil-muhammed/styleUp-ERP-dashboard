import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { useAssignStaffShopMutation } from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

const SHOP_OPTIONS = shopsFixture.slice(0, 4);

export type AssignShopSheetProps = {
  staff: StaffListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssignShopSheet({
  staff,
  open,
  onOpenChange,
}: AssignShopSheetProps): React.ReactElement {
  const { t } = useTranslation('staff-management');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('assignShop.title')}</SheetTitle>
        </SheetHeader>
        {open ? (
          <AssignShopSheetForm key={staff.id} staff={staff} onOpenChange={onOpenChange} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function AssignShopSheetForm({
  staff,
  onOpenChange,
}: {
  staff: StaffListItem;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const [merchantId, setMerchantId] = useState(staff.merchantId);
  const mutation = useAssignStaffShopMutation(staff.id);

  const handleSubmit = (): void => {
    mutation.mutate({ merchantId }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <>
      <div className="mt-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('assignShop.description', { name: staff.name })}
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('assignShop.shopLabel')}</label>
          <Select value={merchantId} onValueChange={setMerchantId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHOP_OPTIONS.map((shop) => (
                <SelectItem key={shop.id} value={shop.id}>
                  {shop.shopName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <SheetFooter className="mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t('assignShop.cancel')}
        </Button>
        <Button disabled={mutation.isPending} onClick={handleSubmit}>
          {t('assignShop.confirm')}
        </Button>
      </SheetFooter>
    </>
  );
}
