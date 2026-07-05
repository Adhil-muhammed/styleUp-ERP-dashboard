import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from '@/features/staff-management/hooks/use-staff-management-queries';
import {
  CreateStaffSchema,
  UpdateStaffSchema,
  type CreateStaffInput,
  type UpdateStaffInput,
} from '@/features/staff-management/types/staff.schema';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { STAFF_ROLES } from '@/features/staff-management/types/staff';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useScope } from '@/shared/hooks/use-scope';

const SHOP_OPTIONS = shopsFixture.slice(0, 4);

type StaffFormSheetProps =
  | {
      mode: 'create';
      staff?: undefined;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }
  | {
      mode: 'edit';
      staff: StaffListItem;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };

export function StaffFormSheet(props: StaffFormSheetProps): React.ReactElement {
  const { mode, open, onOpenChange } = props;
  const staff = props.mode === 'edit' ? props.staff : undefined;
  const { t } = useTranslation('staff-management');
  const { merchantId } = useScope();

  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation(staff?.id ?? '');

  const isCreate = mode === 'create';
  const isPending = createMutation.isPending || updateMutation.isPending;

  const createForm = useForm<CreateStaffInput>({
    resolver: zodResolver(CreateStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      merchantId: merchantId ?? SHOP_OPTIONS[0]?.id ?? '',
      role: 'stylist',
      status: 'active',
      availability: 'available',
      skillIds: [],
    },
  });

  const editForm = useForm<UpdateStaffInput>({
    resolver: zodResolver(UpdateStaffSchema),
    defaultValues: {
      name: staff?.name ?? '',
      email: staff?.email ?? '',
      phone: staff?.phone ?? '',
      role: staff?.role ?? 'stylist',
      status: staff?.status ?? 'active',
      availability: staff?.availability ?? 'available',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset({
        name: '',
        email: '',
        phone: '',
        merchantId: merchantId ?? SHOP_OPTIONS[0]?.id ?? '',
        role: 'stylist',
        status: 'active',
        availability: 'available',
        skillIds: [],
      });
    } else if (staff) {
      editForm.reset({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        status: staff.status,
        availability: staff.availability,
      });
    }
  }, [open, isCreate, staff, merchantId, createForm, editForm]);

  const handleCreate = createForm.handleSubmit((values) => {
    createMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  const handleEdit = editForm.handleSubmit((values) => {
    updateMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isCreate ? t('form.addTitle') : t('form.editTitle')}</SheetTitle>
        </SheetHeader>

        {isCreate ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              void handleCreate(event);
            }}
          >
            <Field label={t('form.name')} error={createForm.formState.errors.name?.message}>
              <Input {...createForm.register('name')} />
            </Field>
            <Field label={t('form.email')} error={createForm.formState.errors.email?.message}>
              <Input type="email" {...createForm.register('email')} />
            </Field>
            <Field label={t('form.phone')} error={createForm.formState.errors.phone?.message}>
              <Input {...createForm.register('phone')} />
            </Field>
            <Field label={t('form.shop')}>
              <Select
                value={createForm.watch('merchantId')}
                onValueChange={(value) => createForm.setValue('merchantId', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHOP_OPTIONS.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.shopName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <SelectField
              label={t('form.role')}
              value={createForm.watch('role')}
              onChange={(value) => createForm.setValue('role', value as CreateStaffInput['role'])}
              options={STAFF_ROLES.map((role) => ({ value: role, label: t(`role.${role}`) }))}
            />
            <SelectField
              label={t('form.status')}
              value={createForm.watch('status')}
              onChange={(value) =>
                createForm.setValue('status', value as CreateStaffInput['status'])
              }
              options={[
                { value: 'active', label: t('status.active') },
                { value: 'inactive', label: t('status.inactive') },
              ]}
            />
            <SelectField
              label={t('form.availability')}
              value={createForm.watch('availability')}
              onChange={(value) =>
                createForm.setValue('availability', value as CreateStaffInput['availability'])
              }
              options={[
                { value: 'available', label: t('availability.available') },
                { value: 'busy', label: t('availability.busy') },
                { value: 'off', label: t('availability.off') },
              ]}
            />
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isPending}>
                {t('form.save')}
              </Button>
            </SheetFooter>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              void handleEdit(event);
            }}
          >
            <Field label={t('form.name')} error={editForm.formState.errors.name?.message}>
              <Input {...editForm.register('name')} />
            </Field>
            <Field label={t('form.email')} error={editForm.formState.errors.email?.message}>
              <Input type="email" {...editForm.register('email')} />
            </Field>
            <Field label={t('form.phone')} error={editForm.formState.errors.phone?.message}>
              <Input {...editForm.register('phone')} />
            </Field>
            <SelectField
              label={t('form.role')}
              value={editForm.watch('role')}
              onChange={(value) => editForm.setValue('role', value as UpdateStaffInput['role'])}
              options={STAFF_ROLES.map((role) => ({ value: role, label: t(`role.${role}`) }))}
            />
            <SelectField
              label={t('form.status')}
              value={editForm.watch('status')}
              onChange={(value) => editForm.setValue('status', value as UpdateStaffInput['status'])}
              options={[
                { value: 'active', label: t('status.active') },
                { value: 'inactive', label: t('status.inactive') },
              ]}
            />
            <SelectField
              label={t('form.availability')}
              value={editForm.watch('availability')}
              onChange={(value) =>
                editForm.setValue('availability', value as UpdateStaffInput['availability'])
              }
              options={[
                { value: 'available', label: t('availability.available') },
                { value: 'busy', label: t('availability.busy') },
                { value: 'off', label: t('availability.off') },
              ]}
            />
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isPending}>
                {t('form.save')}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}): React.ReactElement {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
