import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateBlockedSlotMutation,
  useUpdateBlockedSlotMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { BlockedSlotSchema, type BlockedSlotFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { BlockedSlot } from '@/features/calendar-scheduling/types/blocked-slot';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Sheet } from '@/shared/components/ui/sheet';
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

type BlockedSlotFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  slot?: BlockedSlot;
  defaultStart?: string;
  defaultEnd?: string;
};

function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function BlockedSlotFormSheet({
  open,
  onOpenChange,
  shopId,
  slot,
  defaultStart,
  defaultEnd,
}: BlockedSlotFormSheetProps): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const createMutation = useCreateBlockedSlotMutation();
  const updateMutation = useUpdateBlockedSlotMutation(slot?.id ?? '');

  const form = useForm<BlockedSlotFormInput>({
    resolver: zodResolver(BlockedSlotSchema),
    defaultValues: {
      scope: 'shop',
      shopId,
      start: toDatetimeLocal(defaultStart),
      end: toDatetimeLocal(defaultEnd),
      reason: '',
    },
    values: slot
      ? {
          scope: slot.scope,
          shopId: slot.shopId,
          staffId: slot.staffId,
          start: toDatetimeLocal(slot.start),
          end: toDatetimeLocal(slot.end),
          reason: slot.reason,
        }
      : undefined,
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      start: new Date(values.start).toISOString(),
      end: new Date(values.end).toISOString(),
    };
    const handler = slot
      ? updateMutation.mutateAsync(payload)
      : createMutation.mutateAsync(payload);
    void handler.then(() => onOpenChange(false));
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={slot ? t('blocked.editTitle') : t('blocked.addTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              form="blocked-form"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {t('actions.save')}
            </Button>
          </>
        }
      >
        <form id="blocked-form" onSubmit={onSubmit} className={cn(formSheet.form)}>
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
      </FormSheetContent>
    </Sheet>
  );
}
