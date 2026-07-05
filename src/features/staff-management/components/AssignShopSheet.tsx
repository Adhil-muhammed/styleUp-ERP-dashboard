import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { useAssignStaffShopMutation } from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Sheet } from '@/shared/components/ui/sheet';
import { formSheet } from '@/theme/responsive';

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
      {open ? (
        <AssignShopSheetContent
          key={staff.id}
          staff={staff}
          onOpenChange={onOpenChange}
          title={t('assignShop.title')}
        />
      ) : null}
    </Sheet>
  );
}

function AssignShopSheetContent({
  staff,
  onOpenChange,
  title,
}: {
  staff: StaffListItem;
  onOpenChange: (open: boolean) => void;
  title: string;
}): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const [merchantId, setMerchantId] = useState(staff.merchantId);
  const mutation = useAssignStaffShopMutation(staff.id);

  const handleSubmit = (): void => {
    mutation.mutate({ merchantId }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <FormSheetContent
      title={title}
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('assignShop.cancel')}
          </Button>
          <Button type="button" disabled={mutation.isPending} onClick={handleSubmit}>
            {t('assignShop.confirm')}
          </Button>
        </>
      }
    >
      <div className={formSheet.form}>
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
    </FormSheetContent>
  );
}
