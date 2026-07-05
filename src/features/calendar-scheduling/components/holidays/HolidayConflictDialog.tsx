import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import type { HolidayConflict } from '@/features/calendar-scheduling/types/holiday';

type HolidayConflictDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: HolidayConflict[];
  onConfirm: () => void;
  isPending?: boolean;
};

export function HolidayConflictDialog({
  open,
  onOpenChange,
  conflicts,
  onConfirm,
  isPending = false,
}: HolidayConflictDialogProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('holidays.conflictTitle')}
      description={t('holidays.conflictDescription', { count: conflicts.length })}
      confirmLabel={t('holidays.conflictConfirm')}
      cancelLabel={t('actions.cancel')}
      variant="destructive"
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
