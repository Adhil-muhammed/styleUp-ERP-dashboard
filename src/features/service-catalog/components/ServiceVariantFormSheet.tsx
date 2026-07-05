import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceVariantImageField } from '@/features/service-catalog/components/ServiceVariantImageField';
import {
  useCategoryListQuery,
  useCreateServiceVariantMutation,
  useUpdateServiceVariantMutation,
} from '@/features/service-catalog/hooks/use-service-catalog-queries';
import {
  CreateServiceVariantSchema,
  SERVICE_GENDERS,
  UpdateServiceVariantSchema,
  type CreateServiceVariantInput,
  type ServiceVariantListItem,
  type UpdateServiceVariantInput,
} from '@/features/service-catalog/types/service-variant';
import { FormSheetContent } from '@/shared/components/sheet/FormSheetContent';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Sheet } from '@/shared/components/ui/sheet';
import { formSheet } from '@/theme/responsive';

const CREATE_FORM_ID = 'service-variant-create-form';
const EDIT_FORM_ID = 'service-variant-edit-form';

type ServiceVariantFormSheetProps =
  | {
      mode: 'create';
      variant?: undefined;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }
  | {
      mode: 'edit';
      variant: ServiceVariantListItem;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };

export function ServiceVariantFormSheet(props: ServiceVariantFormSheetProps): React.ReactElement {
  const { mode, open, onOpenChange } = props;
  const variant = props.mode === 'edit' ? props.variant : undefined;
  const { t } = useTranslation('service-catalog');

  const isCreate = mode === 'create';
  const formId = isCreate ? CREATE_FORM_ID : EDIT_FORM_ID;

  const { data: categoriesData } = useCategoryListQuery({ page: 1, pageSize: 100 });
  const categories = categoriesData?.data ?? [];

  const createMutation = useCreateServiceVariantMutation();
  const updateMutation = useUpdateServiceVariantMutation(variant?.id ?? '');
  const isPending = createMutation.isPending || updateMutation.isPending;

  const createForm = useForm<CreateServiceVariantInput>({
    resolver: zodResolver(CreateServiceVariantSchema),
    defaultValues: {
      name: '',
      categoryId: categories[0]?.id ?? '',
      gender: 'unisex',
      durationMinutes: 30,
      price: 499,
      description: '',
      imageUrl: '',
      status: 'active',
      sortOrder: 0,
    },
  });

  const editForm = useForm<UpdateServiceVariantInput>({
    resolver: zodResolver(UpdateServiceVariantSchema),
    defaultValues: {
      name: variant?.name ?? '',
      categoryId: variant?.categoryId ?? '',
      gender: variant?.gender ?? 'unisex',
      durationMinutes: variant?.durationMinutes ?? 30,
      price: variant?.price ?? 0,
      description: variant?.description ?? '',
      imageUrl: variant?.imageUrl ?? '',
      status: variant?.status ?? 'active',
      sortOrder: variant?.sortOrder ?? 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset({
        name: '',
        categoryId: categories[0]?.id ?? '',
        gender: 'unisex',
        durationMinutes: 30,
        price: 499,
        description: '',
        imageUrl: '',
        status: 'active',
        sortOrder: 0,
      });
    } else if (variant) {
      editForm.reset({
        name: variant.name,
        categoryId: variant.categoryId,
        gender: variant.gender,
        durationMinutes: variant.durationMinutes,
        price: variant.price,
        description: variant.description ?? '',
        imageUrl: variant.imageUrl ?? '',
        status: variant.status,
        sortOrder: variant.sortOrder,
      });
    }
  }, [open, isCreate, variant, categories, createForm, editForm]);

  const handleCreate = createForm.handleSubmit((values) => {
    createMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  const handleEdit = editForm.handleSubmit((values) => {
    updateMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  });

  const form = isCreate ? createForm : editForm;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <FormSheetContent
        title={isCreate ? t('form.addVariantTitle') : t('form.editVariantTitle')}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('confirm.cancel')}
            </Button>
            <Button type="submit" form={formId} disabled={isPending}>
              {t('form.save')}
            </Button>
          </>
        }
      >
        <form
          id={formId}
          className={formSheet.form}
          onSubmit={(event) => {
            if (isCreate) {
              void handleCreate(event);
            } else {
              void handleEdit(event);
            }
          }}
        >
          <Field label={t('form.name')} error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} />
          </Field>
          <Field label={t('form.category')} error={form.formState.errors.categoryId?.message}>
            <Select
              value={form.watch('categoryId')}
              onValueChange={(value) => form.setValue('categoryId', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t('form.gender')} error={form.formState.errors.gender?.message}>
            <Select
              value={form.watch('gender')}
              onValueChange={(value) =>
                form.setValue('gender', value as CreateServiceVariantInput['gender'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {t(`gender.${gender}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label={t('form.durationMinutes')}
            error={form.formState.errors.durationMinutes?.message}
          >
            <Input type="number" min={1} {...form.register('durationMinutes', { valueAsNumber: true })} />
          </Field>
          <Field label={t('form.price')} error={form.formState.errors.price?.message}>
            <Input type="number" min={0} step="0.01" {...form.register('price', { valueAsNumber: true })} />
          </Field>
          <Field label={t('form.sortOrder')} error={form.formState.errors.sortOrder?.message}>
            <Input type="number" min={0} {...form.register('sortOrder', { valueAsNumber: true })} />
          </Field>
          <Field label={t('form.description')}>
            <Textarea rows={3} {...form.register('description')} />
          </Field>
          <Field label={t('form.image')}>
            <Controller
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <ServiceVariantImageField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
          </Field>
          <Field label={t('form.status')}>
            <Select
              value={form.watch('status')}
              onValueChange={(value) =>
                form.setValue('status', value as CreateServiceVariantInput['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </form>
      </FormSheetContent>
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
