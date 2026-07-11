import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BlockedSlotFormFields } from '@/features/calendar-scheduling/components/blocked-slots/BlockedSlotFormFields';
import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Sheet } from '@/shared/components/ui/sheet';

type BlockedSlotFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  slot?: BlockedSlot;
  defaultStart?: string;
  defaultEnd?: string;
};

export function BlockedSlotFormSheet({
  open,
  onOpenChange,
  shopId,
  slot,
  defaultStart,
  defaultEnd,
}: BlockedSlotFormSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const [isPending, setIsPending] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={slot ? t('blocked.editTitle') : t('blocked.addTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="blocked-form" disabled={isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <BlockedSlotFormFields
          formId="blocked-form"
          shopId={shopId}
          slot={slot}
          defaultStart={defaultStart}
          defaultEnd={defaultEnd}
          active={open}
          onSuccess={() => onOpenChange(false)}
          onPendingChange={setIsPending}
        />
      </FormSheetContent>
    </Sheet>
  );
}
