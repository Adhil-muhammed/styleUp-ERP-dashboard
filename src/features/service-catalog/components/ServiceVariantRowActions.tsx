import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceVariantFormSheet } from '@/features/service-catalog/components/ServiceVariantFormSheet';
import { useDeleteServiceVariantMutation } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import type { ServiceVariantListItem } from '@/features/service-catalog/types/service-variant';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { PERMISSIONS } from '@/shared/config/permissions';
import { usePermissions } from '@/shared/hooks/use-permissions';

export type ServiceVariantRowActionsProps = {
  variant: ServiceVariantListItem;
};

export function ServiceVariantRowActions({
  variant,
}: ServiceVariantRowActionsProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.services.manage);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteServiceVariantMutation(variant.id);

  const handleDelete = (): void => {
    deleteMutation.mutate(undefined, { onSuccess: () => setDeleteOpen(false) });
  };

  const items = canManage
    ? [
        {
          id: 'edit',
          label: t('actions.edit'),
          icon: Pencil,
          onSelect: () => setEditOpen(true),
        },
        {
          id: 'delete',
          label: t('actions.delete'),
          icon: Trash2,
          onSelect: () => setDeleteOpen(true),
          variant: 'destructive' as const,
        },
      ]
    : [];

  return (
    <>
      <ActionMenu items={items} />

      <ServiceVariantFormSheet
        mode="edit"
        variant={variant}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('confirm.deleteVariant.title')}
        description={t('confirm.deleteVariant.description', { name: variant.name })}
        confirmLabel={t('actions.delete')}
        cancelLabel={t('confirm.cancel')}
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
