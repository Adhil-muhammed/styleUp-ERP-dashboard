import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BulkSchedulePreview } from '@/features/calendar-scheduling/types/bulk-schedule';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';

type BulkSchedulePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: BulkSchedulePreview | null;
  onConfirm: () => void;
  isPending?: boolean;
};

export function BulkSchedulePreviewDialog({
  open,
  onOpenChange,
  preview,
  onConfirm,
  isPending = false,
}: BulkSchedulePreviewDialogProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('bulk.previewTitle')}
      description={
        preview
          ? t('bulk.previewDescription', {
              staff: preview.affectedStaffCount,
              dates: preview.affectedDateCount,
              total: preview.totalEntries,
            })
          : t('bulk.previewEmpty')
      }
      confirmLabel={t('bulk.confirmApply')}
      cancelLabel={t('actions.cancel')}
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
