import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateBlockedSlotMutation,
  useUpdateBlockedSlotMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { toDatetimeLocal } from '@/features/calendar-scheduling/lib/datetime-local';
import { BlockedSlotSchema, type BlockedSlotFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formSheet } from '@/theme/responsive';
import { cn } from '@/shared/lib/utils';

export type BlockedSlotFormFieldsProps = {
  formId: string;
  shopId: string;
  slot?: BlockedSlot;
  defaultStart?: string;
  defaultEnd?: string;
  active?: boolean;
  onSuccess: () => void;
  onPendingChange?: (pending: boolean) => void;
};

export function BlockedSlotFormFields({
  formId,
  shopId,
  slot,
  defaultStart,
  defaultEnd,
  active = true,
  onSuccess,
  onPendingChange,
}: BlockedSlotFormFieldsProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const createMutation = useCreateBlockedSlotMutation();
  const updateMutation = useUpdateBlockedSlotMutation(slot?.id ?? '');

  const editValues = useMemo(
    () =>
      slot
        ? {
            scope: slot.scope,
            shopId: slot.shopId,
            staffId: slot.staffId,
            start: toDatetimeLocal(slot.start),
            end: toDatetimeLocal(slot.end),
            reason: slot.reason,
          }
        : undefined,
    [slot?.id, slot?.scope, slot?.shopId, slot?.staffId, slot?.start, slot?.end, slot?.reason],
  );

  const form = useForm<BlockedSlotFormInput>({
    resolver: zodResolver(BlockedSlotSchema),
    defaultValues: {
      scope: 'shop',
      shopId,
      start: toDatetimeLocal(defaultStart),
      end: toDatetimeLocal(defaultEnd),
      reason: '',
    },
    values: editValues,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    if (!active || slot) return;
    form.reset({
      scope: 'shop',
      shopId,
      start: toDatetimeLocal(defaultStart),
      end: toDatetimeLocal(defaultEnd),
      reason: '',
    });
  }, [active, slot, shopId, defaultStart, defaultEnd, form]);

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      start: new Date(values.start).toISOString(),
      end: new Date(values.end).toISOString(),
    };
    const handler = slot
      ? updateMutation.mutateAsync(payload)
      : createMutation.mutateAsync(payload);
    void handler.then(() => onSuccess());
  });

  return (
    <form id={formId} onSubmit={onSubmit} className={cn(formSheet.form)}>
      <Select
        value={form.watch('scope')}
        onValueChange={(v) => form.setValue('scope', v as BlockedSlotFormInput['scope'])}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="shop">{t('blocked.scopeShop')}</SelectItem>
          <SelectItem value="staff">{t('blocked.scopeStaff')}</SelectItem>
        </SelectContent>
      </Select>
      <Input type="datetime-local" {...form.register('start')} />
      <Input type="datetime-local" {...form.register('end')} />
      <Textarea placeholder={t('blocked.reason')} {...form.register('reason')} />
    </form>
  );
}
