import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerListItem, UpdateCustomerInput } from '@/features/user-management/types/customer';
import { UpdateCustomerSchema } from '@/features/user-management/types/customer';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export type CustomerEditSheetProps = {
  customer: CustomerListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateCustomerInput) => void;
  isPending?: boolean;
};

export function CustomerEditSheet({
  customer,
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: CustomerEditSheetProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const form = useForm<UpdateCustomerInput>({
    resolver: zodResolver(UpdateCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    }
  }, [open, customer, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('actions.edit')}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              {t('columns.name')}
            </label>
            <Input id="edit-name" {...form.register('name')} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{t('errors.nameRequired')}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-email" className="text-sm font-medium">
              {t('columns.email')}
            </label>
            <Input id="edit-email" type="email" {...form.register('email')} />
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive">{t('errors.emailInvalid')}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-phone" className="text-sm font-medium">
              {t('columns.phone')}
            </label>
            <Input id="edit-phone" {...form.register('phone')} />
            {form.formState.errors.phone ? (
              <p className="text-sm text-destructive">{t('errors.phoneRequired')}</p>
            ) : null}
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              {t('form.save')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
