import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { BulkSchedulePreviewDialog } from '@/features/calendar-scheduling/components/bulk/BulkSchedulePreviewDialog';
import { ShopStaffSelector } from '@/features/calendar-scheduling/components/ShopStaffSelector';
import {
  useApplyBulkScheduleMutation,
  usePreviewBulkScheduleMutation,
} from '@/features/calendar-scheduling/hooks/use-calendar-scheduling-queries';
import { BulkScheduleSchema, type BulkScheduleFormInput } from '@/features/calendar-scheduling/types/calendar.schema';
import type { BulkSchedulePreview } from '@/features/calendar-scheduling/types/bulk-schedule';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useScope } from '@/shared/hooks/use-scope';
import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';

export function BulkScheduleUpdateTab(): React.ReactElement {
  const { t } = useTranslation('calendar-scheduling');
  const { merchantId } = useScope();
  const [shopId, setShopId] = useState(merchantId ?? shopsFixture[0]?.id ?? '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<BulkSchedulePreview | null>(null);

  const previewMutation = usePreviewBulkScheduleMutation();
  const applyMutation = useApplyBulkScheduleMutation();

  const form = useForm<BulkScheduleFormInput>({
    resolver: zodResolver(BulkScheduleSchema),
    defaultValues: {
      action: 'blocked',
      shopId,
      staffIds: staffFixture.filter((s) => s.merchantId === shopId).slice(0, 2).map((s) => s.id),
      dateFrom: new Date().toISOString().slice(0, 10),
      dateTo: new Date().toISOString().slice(0, 10),
      blockedReason: '',
      holidayName: '',
    },
  });

  const onPreview = form.handleSubmit((values) => {
    previewMutation.mutate(values, {
      onSuccess: (result) => {
        setPreview(result);
        setPreviewOpen(true);
      },
    });
  });

  const onApply = (): void => {
    const values = form.getValues();
    applyMutation.mutate(values, { onSuccess: () => setPreviewOpen(false) });
  };

  return (
    <div className="max-w-xl space-y-4">
      <ShopStaffSelector shopId={shopId} onShopChange={setShopId} />
      <form onSubmit={onPreview} className="space-y-3 rounded-lg border p-4">
        <Select
          value={form.watch('action')}
          onValueChange={(v) => form.setValue('action', v as BulkScheduleFormInput['action'])}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blocked">{t('bulk.actionBlocked')}</SelectItem>
            <SelectItem value="holiday">{t('bulk.actionHoliday')}</SelectItem>
            <SelectItem value="working-hours">{t('bulk.actionWorkingHours')}</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" {...form.register('dateFrom')} />
        <Input type="date" {...form.register('dateTo')} />
        {form.watch('action') === 'blocked' ? (
          <Input placeholder={t('blocked.reason')} {...form.register('blockedReason')} />
        ) : null}
        {form.watch('action') === 'holiday' ? (
          <Input placeholder={t('holidays.name')} {...form.register('holidayName')} />
        ) : null}
        <Button type="submit" disabled={previewMutation.isPending}>
          {t('bulk.preview')}
        </Button>
      </form>
      <BulkSchedulePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        preview={preview}
        onConfirm={onApply}
        isPending={applyMutation.isPending}
      />
    </div>
  );
}
