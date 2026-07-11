import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ManualBookingForm } from '@/features/calendar-scheduling/components/ManualBookingForm';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Sheet } from '@/shared/components/ui/sheet';

type ManualBookingSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  defaultStart?: string;
  defaultStaffId?: string;
};

export function ManualBookingSheet({
  open,
  onOpenChange,
  shopId,
  defaultStart,
  defaultStaffId,
}: ManualBookingSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const [isPending, setIsPending] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={t('manualBooking.title')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="manual-booking-form" disabled={isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <ManualBookingForm
          formId="manual-booking-form"
          shopId={shopId}
          defaultStart={defaultStart}
          defaultStaffId={defaultStaffId}
          active={open}
          onSuccess={() => onOpenChange(false)}
          onPendingChange={setIsPending}
        />
      </FormSheetContent>
    </Sheet>
  );
}
