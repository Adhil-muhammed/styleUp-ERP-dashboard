import { Link } from 'react-router-dom';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingDetail } from '@/features/booking-management/types/booking-detail';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { userDetailPath } from '@/shared/config/routes';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type BookingCustomerSectionProps = {
  data: BookingDetail;
};

export function BookingCustomerSection({ data }: BookingCustomerSectionProps): React.ReactElement {
  const { t } = useTranslation('booking-management');

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{t('details.customer')}</h3>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {data.customerAvatarUrl ? (
            <AvatarImage src={data.customerAvatarUrl} alt={data.customerName} />
          ) : null}
          <AvatarFallback>{initials(data.customerName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-0.5">
          <Link
            to={userDetailPath(data.customerId)}
            className="font-medium hover:underline"
          >
            {data.customerName}
          </Link>
          <p className="text-sm text-muted-foreground">{data.customerPhone}</p>
        </div>
      </div>
    </section>
  );
}
