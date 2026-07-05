import { format } from 'date-fns';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import { Button } from '@/shared/components/ui/button';

type BlockedSlotsPanelProps = {
  slots: BlockedSlot[];
  onEdit: (slot: BlockedSlot) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
};

export function BlockedSlotsPanel({
  slots,
  onEdit,
  onDelete,
  canManage,
}: BlockedSlotsPanelProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');

  if (!slots.length) {
    return <p className="text-sm text-muted-foreground">{t('blocked.empty')}</p>;
  }

  return (
    <ul className="space-y-2">
      {slots.map((slot) => (
        <li key={slot.id} className="rounded-lg border p-3">
          <p className="font-medium">{slot.reason}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(slot.start), 'dd MMM yyyy, HH:mm')} –{' '}
            {format(new Date(slot.end), 'dd MMM yyyy, HH:mm')}
          </p>
          {canManage ? (
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(slot)}>
                {t('actions.edit')}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(slot.id)}>
                {t('actions.delete')}
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
