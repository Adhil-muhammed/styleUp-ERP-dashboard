import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { HolidayFormFields } from '@/features/calendar-scheduling/components/holidays/HolidayFormFields';
import type { Holiday } from '@/features/calendar-scheduling/types/holiday';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Sheet } from '@/shared/components/ui/sheet';

type HolidayFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  holiday?: Holiday;
  defaultStartDate?: string;
  defaultEndDate?: string;
  onSaved?: (holiday: Holiday) => void;
};

export function HolidayFormSheet({
  open,
  onOpenChange,
  shopId,
  holiday,
  defaultStartDate,
  defaultEndDate,
  onSaved,
}: HolidayFormSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const [isPending, setIsPending] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={holiday ? t('holidays.editTitle') : t('holidays.addTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" form="holiday-form" disabled={isPending}>
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <HolidayFormFields
          formId="holiday-form"
          shopId={shopId}
          holiday={holiday}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
          active={open}
          onSuccess={() => onOpenChange(false)}
          onSaved={onSaved}
          onPendingChange={setIsPending}
        />
      </FormSheetContent>
    </Sheet>
  );
}
