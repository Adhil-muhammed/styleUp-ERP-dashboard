import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/features/service-catalog/hooks/use-service-catalog-queries';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  type CreateCategoryInput,
  type ServiceCategoryListItem,
  type UpdateCategoryInput,
} from '@/features/service-catalog/types/category';
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
import { Sheet } from '@/shared/components/ui/sheet';
import { formSheet } from '@/theme/responsive';

const CREATE_FORM_ID = 'category-create-form';
const EDIT_FORM_ID = 'category-edit-form';

type CategoryFormSheetProps =
  | {
      mode: 'create';
      category?: undefined;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }
  | {
      mode: 'edit';
      category: ServiceCategoryListItem;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };

export function CategoryFormSheet(props: CategoryFormSheetProps): React.ReactElement {
  const { mode, open, onOpenChange } = props;
  const category = props.mode === 'edit' ? props.category : undefined;
  const { t } = useTranslation('service-catalog');

  const isCreate = mode === 'create';
  const formId = isCreate ? CREATE_FORM_ID : EDIT_FORM_ID;

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation(category?.id ?? '');
  const isPending = createMutation.isPending || updateMutation.isPending;

  const createForm = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      status: 'active',
    },
  });

  const editForm = useForm<UpdateCategoryInput>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      imageUrl: category?.imageUrl ?? '',
      status: category?.status ?? 'active',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset({ name: '', imageUrl: '', status: 'active' });
    } else if (category) {
      editForm.reset({
        name: category.name,
        imageUrl: category.imageUrl ?? '',
        status: category.status,
      });
    }
  }, [open, isCreate, category, createForm, editForm]);

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
        title={isCreate ? t('form.addCategoryTitle') : t('form.editCategoryTitle')}
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
          <Field label={t('form.imageUrl')} error={form.formState.errors.imageUrl?.message}>
            <Input {...form.register('imageUrl')} placeholder="https://" />
          </Field>
          <Field label={t('form.status')}>
            <Select
              value={form.watch('status')}
              onValueChange={(value) =>
                form.setValue('status', value as CreateCategoryInput['status'])
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
