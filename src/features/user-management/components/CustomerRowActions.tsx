import {
  Eye,
  KeyRound,
  LogOut,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CustomerEditSheet } from '@/features/user-management/components/CustomerEditSheet';
import {
  useActivateCustomerMutation,
  useDeleteCustomerMutation,
  useForceLogoutCustomerMutation,
  useResetPasswordCustomerMutation,
  useSuspendCustomerMutation,
  useUpdateCustomerMutation,
} from '@/features/user-management/hooks/use-user-management-queries';
import type { CustomerListItem } from '@/features/user-management/types/customer';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { PERMISSIONS } from '@/shared/config/permissions';
import { userDetailPath } from '@/shared/config/routes';
import { Can } from '@/shared/lib/casl-context';
import { usePermissions } from '@/shared/hooks/use-permissions';

type ConfirmAction = 'suspend' | 'forceLogout' | 'delete';

export type CustomerRowActionsProps = {
  customer: CustomerListItem;
};

export function CustomerRowActions({ customer }: CustomerRowActionsProps): React.ReactElement {
  const { t } = useTranslation('user-management');
  const navigate = useNavigate();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.users.manage);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const updateMutation = useUpdateCustomerMutation(customer.id);
  const suspendMutation = useSuspendCustomerMutation(customer.id);
  const activateMutation = useActivateCustomerMutation(customer.id);
  const forceLogoutMutation = useForceLogoutCustomerMutation(customer.id);
  const resetPasswordMutation = useResetPasswordCustomerMutation(customer.id);
  const deleteMutation = useDeleteCustomerMutation(customer.id);

  const isPending =
    suspendMutation.isPending ||
    activateMutation.isPending ||
    forceLogoutMutation.isPending ||
    resetPasswordMutation.isPending ||
    deleteMutation.isPending;

  const handleConfirm = (): void => {
    if (confirmAction === 'suspend') {
      suspendMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null) });
    } else if (confirmAction === 'forceLogout') {
      forceLogoutMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null) });
    } else if (confirmAction === 'delete') {
      deleteMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null) });
    }
  };

  const confirmConfig = {
    suspend: {
      title: t('confirm.suspend.title'),
      description: t('confirm.suspend.description', { name: customer.name }),
      confirmLabel: t('actions.suspend'),
      variant: 'destructive' as const,
    },
    forceLogout: {
      title: t('confirm.forceLogout.title'),
      description: t('confirm.forceLogout.description', { name: customer.name }),
      confirmLabel: t('actions.forceLogout'),
      variant: 'destructive' as const,
    },
    delete: {
      title: t('confirm.delete.title'),
      description: t('confirm.delete.description', { name: customer.name }),
      confirmLabel: t('actions.delete'),
      variant: 'destructive' as const,
    },
  };

  const activeConfirm = confirmAction ? confirmConfig[confirmAction] : null;

  return (
    <>
      <ActionMenu
        items={[
          {
            id: 'view',
            label: t('actions.view'),
            icon: Eye,
            onSelect: () => {
              void navigate(userDetailPath(customer.id));
            },
          },
          {
            id: 'edit',
            label: t('actions.edit'),
            icon: Pencil,
            onSelect: () => setEditOpen(true),
            hidden: !canManage,
          },
          {
            id: 'suspend',
            label: t('actions.suspend'),
            icon: ShieldOff,
            variant: 'destructive',
            onSelect: () => setConfirmAction('suspend'),
            hidden: !canManage || customer.status === 'suspended',
          },
          {
            id: 'activate',
            label: t('actions.activate'),
            icon: ShieldCheck,
            onSelect: () => activateMutation.mutate(),
            hidden: !canManage || customer.status !== 'suspended',
          },
          {
            id: 'forceLogout',
            label: t('actions.forceLogout'),
            icon: LogOut,
            variant: 'destructive',
            onSelect: () => setConfirmAction('forceLogout'),
            hidden: !canManage,
          },
          {
            id: 'resetPassword',
            label: resetSuccess ? t('actions.resetPasswordSent') : t('actions.resetPassword'),
            icon: KeyRound,
            onSelect: () => {
              resetPasswordMutation.mutate(undefined, {
                onSuccess: () => setResetSuccess(true),
              });
            },
            hidden: !canManage,
            disabled: resetPasswordMutation.isPending,
          },
          {
            id: 'delete',
            label: t('actions.delete'),
            icon: Trash2,
            variant: 'destructive',
            onSelect: () => setConfirmAction('delete'),
            hidden: !canManage,
          },
        ]}
        triggerLabel={t('actions.menu')}
      />

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
          onConfirm={handleConfirm}
          isPending={isPending}
        />
      ) : null}

      <Can I="manage" a={PERMISSIONS.users.manage}>
        <CustomerEditSheet
          customer={customer}
          open={editOpen}
          onOpenChange={setEditOpen}
          isPending={updateMutation.isPending}
          onSubmit={(data) => {
            updateMutation.mutate(data, {
              onSuccess: () => setEditOpen(false),
            });
          }}
        />
      </Can>
    </>
  );
}
