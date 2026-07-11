import type { CalendarEvent as KitCalendarEvent } from 'calendarkit-basic';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BookingDetailsContent,
  BookingDetailsFooter,
} from '@/features/booking-management/components/BookingDetailsContent';
import { useBookingDetailQuery } from '@/features/booking-management/hooks/use-booking-management-queries';
import { BlockedSlotFormFields } from '@/features/calendar-scheduling/components/blocked-slots/BlockedSlotFormFields';
import { CalendarKitFormModal } from '@/features/calendar-scheduling/components/calendar/CalendarKitFormModal';
import { HolidayFormFields } from '@/features/calendar-scheduling/components/holidays/HolidayFormFields';
import { ManualBookingForm } from '@/features/calendar-scheduling/components/ManualBookingForm';
import {
  useDeleteBlockedSlotMutation,
  useDeleteHolidayMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { findScheduleEvent } from '@/features/calendar-scheduling/lib/adapters/from-kit-event';
import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import type { Holiday } from '@/features/calendar-scheduling/types/holiday';
import type { ScheduleEvent } from '@/features/calendar-scheduling/types/schedule-event';
import { Button } from '@/shared/components/ui/button';

export type CalendarEventFormMode = 'shop' | 'holiday' | 'blocked' | 'staff';

export type CalendarEventFormConfig = {
  mode: CalendarEventFormMode;
  shopId: string;
  holidays?: Holiday[];
  blockedSlots?: BlockedSlot[];
  defaultStaffId?: string;
  onHolidaySaved?: (holiday: Holiday) => void;
};

type FormKind = 'booking-create' | 'booking-detail' | 'holiday' | 'blocked';

type CalendarEventFormRouterProps = {
  isOpen: boolean;
  onClose: () => void;
  kitEvent?: KitCalendarEvent | null;
  initialDate?: Date;
  onSave: (event: Partial<KitCalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
  readOnly: boolean;
  events: ScheduleEvent[];
  config: CalendarEventFormConfig;
};

function resolveFormKind(
  mode: CalendarEventFormMode,
  kitEvent: KitCalendarEvent | null | undefined,
  domainEvent: ScheduleEvent | undefined,
): FormKind | null {
  if (!kitEvent) {
    if (mode === 'holiday') return 'holiday';
    if (mode === 'blocked') return 'blocked';
    if (mode === 'shop' || mode === 'staff') return 'booking-create';
    return null;
  }

  if (!domainEvent) return null;

  switch (domainEvent.kind) {
    case 'booking':
      return 'booking-detail';
    case 'holiday':
      return 'holiday';
    case 'blocked':
      return 'blocked';
    default:
      return null;
  }
}

function defaultEndFromStart(start: Date): string {
  return new Date(start.getTime() + 60 * 60 * 1000).toISOString();
}

export function CalendarEventFormRouter({
  isOpen,
  onClose,
  kitEvent,
  initialDate,
  onSave,
  onDelete,
  readOnly,
  events,
  config,
}: CalendarEventFormRouterProps): React.ReactElement | null {
  const { t } = useTranslation('calendar-scheduling');
  const [isPending, setIsPending] = useState(false);
  const deleteHolidayMutation = useDeleteHolidayMutation();
  const deleteBlockedMutation = useDeleteBlockedSlotMutation();

  if (!isOpen || readOnly) return null;

  const domainEvent = kitEvent ? findScheduleEvent(events, kitEvent.id) : undefined;
  const formKind = resolveFormKind(config.mode, kitEvent, domainEvent);

  if (!formKind) return null;

  const handleSuccess = (): void => {
    if (kitEvent) {
      onSave(kitEvent);
    } else if (initialDate) {
      onSave({
        title: '',
        start: initialDate,
        end: new Date(initialDate.getTime() + 60 * 60 * 1000),
      });
    }
    onClose();
  };

  const handleDeleteHoliday = (holidayId: string): void => {
    deleteHolidayMutation.mutate(holidayId, {
      onSuccess: () => {
        onDelete?.(kitEvent?.id ?? holidayId);
        onClose();
      },
    });
  };

  const handleDeleteBlocked = (slotId: string): void => {
    deleteBlockedMutation.mutate(slotId, {
      onSuccess: () => {
        onDelete?.(kitEvent?.id ?? slotId);
        onClose();
      },
    });
  };

  const cancelButton = (
    <Button type="button" variant="outline" onClick={onClose}>
      {t('actions.cancel')}
    </Button>
  );

  if (formKind === 'booking-create') {
    const formId = 'calendar-booking-create-form';
    return (
      <CalendarKitFormModal
        isOpen={isOpen}
        onClose={onClose}
        title={t('manualBooking.title')}
        footer={
          <>
            {cancelButton}
            <Button type="submit" form={formId} disabled={isPending} className="ml-auto">
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <ManualBookingForm
          formId={formId}
          shopId={config.shopId}
          defaultStart={initialDate?.toISOString()}
          defaultStaffId={config.defaultStaffId}
          active={isOpen}
          onSuccess={handleSuccess}
          onPendingChange={setIsPending}
        />
      </CalendarKitFormModal>
    );
  }

  if (formKind === 'booking-detail' && domainEvent) {
    const bookingId = domainEvent.meta.entityId;
    return (
      <BookingDetailModal
        isOpen={isOpen}
        onClose={onClose}
        bookingId={bookingId}
        cancelButton={cancelButton}
      />
    );
  }

  if (formKind === 'holiday') {
    const formId = 'calendar-holiday-form';
    const holiday = domainEvent
      ? config.holidays?.find((h) => h.id === domainEvent.meta.entityId)
      : undefined;
    const defaultStartDate = initialDate?.toISOString().slice(0, 10);
    const defaultEndDate = initialDate?.toISOString().slice(0, 10);

    return (
      <CalendarKitFormModal
        isOpen={isOpen}
        onClose={onClose}
        title={holiday ? t('holidays.editTitle') : t('holidays.addTitle')}
        footer={
          <>
            {holiday ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={deleteHolidayMutation.isPending}
                onClick={() => handleDeleteHoliday(holiday.id)}
              >
                {t('actions.delete')}
              </Button>
            ) : null}
            {cancelButton}
            <Button type="submit" form={formId} disabled={isPending} className="ml-auto">
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <HolidayFormFields
          formId={formId}
          shopId={config.shopId}
          holiday={holiday}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
          active={isOpen}
          onSuccess={handleSuccess}
          onSaved={config.onHolidaySaved}
          onPendingChange={setIsPending}
        />
      </CalendarKitFormModal>
    );
  }

  if (formKind === 'blocked') {
    const formId = 'calendar-blocked-form';
    const slot = domainEvent
      ? config.blockedSlots?.find((s) => s.id === domainEvent.meta.entityId)
      : undefined;

    return (
      <CalendarKitFormModal
        isOpen={isOpen}
        onClose={onClose}
        title={slot ? t('blocked.editTitle') : t('blocked.addTitle')}
        footer={
          <>
            {slot ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={deleteBlockedMutation.isPending}
                onClick={() => handleDeleteBlocked(slot.id)}
              >
                {t('actions.delete')}
              </Button>
            ) : null}
            {cancelButton}
            <Button type="submit" form={formId} disabled={isPending} className="ml-auto">
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <BlockedSlotFormFields
          formId={formId}
          shopId={config.shopId}
          slot={slot}
          defaultStart={initialDate?.toISOString()}
          defaultEnd={initialDate ? defaultEndFromStart(initialDate) : undefined}
          active={isOpen}
          onSuccess={handleSuccess}
          onPendingChange={setIsPending}
        />
      </CalendarKitFormModal>
    );
  }

  return null;
}

type BookingDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  cancelButton: React.ReactElement;
};

function BookingDetailModal({
  isOpen,
  onClose,
  bookingId,
  cancelButton,
}: BookingDetailModalProps): React.ReactElement {
  const { t } = useTranslation('booking-management');
  const { data } = useBookingDetailQuery(bookingId);

  return (
    <CalendarKitFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={data ? t('details.title', { id: data.id }) : t('details.loadingTitle')}
      className="max-w-lg"
      footer={
        <>
          {cancelButton}
          <div className="ml-auto flex-1">
            <BookingDetailsFooter bookingId={bookingId} />
          </div>
        </>
      }
    >
      <BookingDetailsContent bookingId={bookingId} />
    </CalendarKitFormModal>
  );
}
