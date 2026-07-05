import { Eye } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingListItem } from '@/features/booking-management/types/booking';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';

export type BookingRowActionsProps = {
  booking: BookingListItem;
  onViewDetails: (booking: BookingListItem) => void;
};

export function BookingRowActions({
  booking,
  onViewDetails,
}: BookingRowActionsProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  return (
    <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <ActionMenu
        items={[
          {
            id: 'view',
            label: t('actions.viewDetails'),
            icon: Eye,
            onSelect: () => onViewDetails(booking),
          },
        ]}
      />
    </div>
  );
}
