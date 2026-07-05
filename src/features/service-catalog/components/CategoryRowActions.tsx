import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryFormSheet } from '@/features/service-catalog/components/CategoryFormSheet';
import { CATEGORY_HAS_VARIANTS_ERROR } from '@/features/service-catalog/api/service-catalog-api';
import { useDeleteCategoryMutation } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import type { ServiceCategoryListItem } from '@/features/service-catalog/types/category';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

export type CategoryRowActionsProps = {
  category: ServiceCategoryListItem;
};

export function CategoryRowActions({ category }: CategoryRowActionsProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.services.manage);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useDeleteCategoryMutation(category.id);
  const hasVariants = category.variantCount > 0;

  const handleDelete = (): void => {
    setDeleteError(null);
    deleteMutation.mutate(undefined, {
      onSuccess: () => setDeleteOpen(false),
      onError: (error) => {
        if (error instanceof Error && error.message === CATEGORY_HAS_VARIANTS_ERROR) {
          setDeleteError(t('confirm.deleteBlocked.description'));
        }
      },
    });
  };

  const items = canManage
    ? [
        {
          id: 'edit',
          label: t('actions.edit'),
          icon: Pencil,
          onSelect: () => setEditOpen(true),
        },
        ...(hasVariants
          ? []
          : [
              {
                id: 'delete',
                label: t('actions.delete'),
                icon: Trash2,
                onSelect: () => {
                  setDeleteError(null);
                  setDeleteOpen(true);
                },
                variant: 'destructive' as const,
              },
            ]),
      ]
    : [];

  return (
    <>
      <ActionMenu items={items} />

      <CategoryFormSheet
        mode="edit"
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen(false);
            setDeleteError(null);
          }
        }}
        title={t('confirm.delete.title')}
        description={deleteError ?? t('confirm.delete.description', { name: category.name })}
        confirmLabel={t('actions.delete')}
        cancelLabel={t('confirm.cancel')}
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
