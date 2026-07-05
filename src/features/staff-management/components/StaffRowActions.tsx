import { Eye, Pencil, Store, Trash2, UserX } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AssignShopSheet } from '@/features/staff-management/components/AssignShopSheet';
import { StaffFormSheet } from '@/features/staff-management/components/StaffFormSheet';
import {
  useDeleteStaffMutation,
  useUpdateStaffStatusMutation,
} from '@/features/staff-management/hooks/use-staff-management-queries';
import type { StaffListItem } from '@/features/staff-management/types/staff';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { PERMISSIONS } from '@/shared/config/permissions';
import { staffDetailPath } from '@/shared/config/routes';
import { usePermissions } from '@/shared/hooks/use-permissions';

type ConfirmAction = 'deactivate' | 'delete';

export type StaffRowActionsProps = {
  staff: StaffListItem;
};

export function StaffRowActions({ staff }: StaffRowActionsProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const navigate = useNavigate();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.staff.manage);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const deactivateMutation = useUpdateStaffStatusMutation(staff.id);
  const deleteMutation = useDeleteStaffMutation(staff.id);

  const isPending = deactivateMutation.isPending || deleteMutation.isPending;

  const handleConfirm = (): void => {
    if (confirmAction === 'deactivate') {
      deactivateMutation.mutate('inactive', { onSuccess: () => setConfirmAction(null) });
    } else if (confirmAction === 'delete') {
      deleteMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null) });
    }
  };

  const confirmConfig = {
    deactivate: {
      title: t('confirm.deactivate.title'),
      description: t('confirm.deactivate.description', { name: staff.name }),
      confirmLabel: t('actions.deactivate'),
      variant: 'destructive' as const,
    },
    delete: {
      title: t('confirm.delete.title'),
      description: t('confirm.delete.description', { name: staff.name }),
      confirmLabel: t('actions.delete'),
      variant: 'destructive' as const,
    },
  };

  const activeConfirm = confirmAction ? confirmConfig[confirmAction] : null;

  const items = [
    {
      id: 'view',
      label: t('actions.view'),
      icon: Eye,
      onSelect: () => navigate(staffDetailPath(staff.id)),
    },
    ...(canManage
      ? [
          {
            id: 'edit',
            label: t('actions.edit'),
            icon: Pencil,
            onSelect: () => setEditOpen(true),
          },
          {
            id: 'assign',
            label: t('actions.assignShop'),
            icon: Store,
            onSelect: () => setAssignOpen(true),
          },
          ...(staff.status === 'active'
            ? [
                {
                  id: 'deactivate',
                  label: t('actions.deactivate'),
                  icon: UserX,
                  onSelect: () => setConfirmAction('deactivate'),
                },
              ]
            : []),
          {
            id: 'delete',
            label: t('actions.delete'),
            icon: Trash2,
            onSelect: () => setConfirmAction('delete'),
            variant: 'destructive' as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <ActionMenu items={items} />

      <StaffFormSheet
        mode="edit"
        staff={staff}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AssignShopSheet staff={staff} open={assignOpen} onOpenChange={setAssignOpen} />

      {activeConfirm ? (
        <ConfirmDialog
          open={confirmAction !== null}
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null);
          }}
          title={activeConfirm.title}
          description={activeConfirm.description}
          confirmLabel={activeConfirm.confirmLabel}
          cancelLabel={t('confirm.cancel')}
          variant={activeConfirm.variant}
          isPending={isPending}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}
