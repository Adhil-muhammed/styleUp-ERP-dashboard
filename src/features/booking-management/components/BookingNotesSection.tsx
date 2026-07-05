import { useEffect, useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useUpdateBookingNotesMutation } from '@/features/booking-management/hooks/use-booking-management-queries';
import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

type BookingNotesSectionProps = {
  data: BookingDetail;
};

export function BookingNotesSection({ data }: BookingNotesSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.bookings.manage);
  const [internalNotes, setInternalNotes] = useState(data.internalNotes);
  const mutation = useUpdateBookingNotesMutation(data.id);

  useEffect(() => {
    setInternalNotes(data.internalNotes);
  }, [data.internalNotes, data.id]);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.notes')}</h3>
      {data.customerNotes ? (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{t('details.customerNotes')}</p>
          <p className="rounded-md border bg-muted/30 p-2 text-sm">{data.customerNotes}</p>
        </div>
      ) : null}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{t('details.internalNotes')}</p>
        {canManage ? (
          <>
            <Textarea
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
              rows={3}
              placeholder={t('details.internalNotesPlaceholder')}
            />
            <Button
              size="sm"
              disabled={mutation.isPending || internalNotes === data.internalNotes}
              onClick={() => mutation.mutate({ internalNotes })}
            >
              {t('actions.saveNotes')}
            </Button>
          </>
        ) : (
          <p className="rounded-md border bg-muted/30 p-2 text-sm">
            {data.internalNotes || t('details.noInternalNotes')}
          </p>
        )}
      </div>
    </section>
  );
}
