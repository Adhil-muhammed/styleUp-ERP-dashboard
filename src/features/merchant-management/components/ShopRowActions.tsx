import {
  CheckCircle,
  Eye,
  Pencil,
  Star,
  StarOff,
  XCircle,
  ShieldOff,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  useApproveShopMutation,
  useFeatureShopMutation,
  useRejectShopMutation,
  useSuspendShopMutation,
} from '@/features/merchant-management/hooks/use-merchant-management-queries';
import type { ShopListItem, ShopListParams } from '@/features/merchant-management/types/shop';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/ConfirmDialog';
import { ConfirmWithReasonDialog } from '@/shared/components/confirm-dialog/ConfirmWithReasonDialog';
import { PERMISSIONS } from '@/shared/config/permissions';
import { shopDetailPath } from '@/shared/config/routes';
import { usePermissions } from '@/shared/hooks/use-permissions';

type ConfirmAction = 'approve' | 'reject' | 'suspend';

export type ShopRowActionsProps = {
  shop: ShopListItem;
  listParams: ShopListParams;
};

export function ShopRowActions({ shop, listParams }: ShopRowActionsProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const navigate = useNavigate();
  const ability = usePermissions();
  const canManage = ability.can('manage', PERMISSIONS.merchants.manage);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const approveMutation = useApproveShopMutation(shop.id);
  const rejectMutation = useRejectShopMutation(shop.id);
  const suspendMutation = useSuspendShopMutation(shop.id);
  const featureMutation = useFeatureShopMutation(listParams);

  const isPending =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    suspendMutation.isPending ||
    featureMutation.isPending;

  const handleConfirm = (): void => {
    if (confirmAction === 'approve') {
      approveMutation.mutate(undefined, { onSuccess: () => setConfirmAction(null) });
    }
  };

  const confirmConfig = {
    approve: {
      title: t('confirm.approve.title'),
      description: t('confirm.approve.description', { name: shop.shopName }),
      confirmLabel: t('actions.approve'),
      variant: 'default' as const,
    },
    reject: {
      title: t('confirm.reject.title'),
      description: t('confirm.reject.description', { name: shop.shopName }),
      confirmLabel: t('actions.reject'),
      variant: 'destructive' as const,
    },
    suspend: {
      title: t('confirm.suspend.title'),
      description: t('confirm.suspend.description', { name: shop.shopName }),
      confirmLabel: t('actions.suspend'),
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
              void navigate(shopDetailPath(shop.id));
            },
          },
          {
            id: 'edit',
            label: t('actions.edit'),
            icon: Pencil,
            onSelect: () => {
              void navigate(shopDetailPath(shop.id));
            },
            hidden: !canManage,
          },
          {
            id: 'approve',
            label: t('actions.approve'),
            icon: CheckCircle,
            onSelect: () => setConfirmAction('approve'),
            hidden: !canManage || shop.status !== 'pending',
          },
          {
            id: 'reject',
            label: t('actions.reject'),
            icon: XCircle,
            variant: 'destructive',
            onSelect: () => setConfirmAction('reject'),
            hidden: !canManage || shop.status !== 'pending',
          },
          {
            id: 'suspend',
            label: t('actions.suspend'),
            icon: ShieldOff,
            variant: 'destructive',
            onSelect: () => setConfirmAction('suspend'),
            hidden: !canManage || shop.status !== 'approved',
          },
          {
            id: 'feature',
            label: shop.isFeatured ? t('actions.unfeature') : t('actions.feature'),
            icon: shop.isFeatured ? StarOff : Star,
            onSelect: () => {
              featureMutation.mutate({ merchantId: shop.id, featured: !shop.isFeatured });
            },
            hidden: !canManage || shop.status !== 'approved',
          },
        ]}
        triggerLabel={t('actions.menu')}
      />

      {confirmAction === 'approve' && activeConfirm ? (
        <ConfirmDialog
          open
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

      {confirmAction === 'reject' ? (
        <ConfirmWithReasonDialog
          open
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null);
          }}
          title={confirmConfig.reject.title}
          description={confirmConfig.reject.description}
          confirmLabel={confirmConfig.reject.confirmLabel}
          cancelLabel={t('confirm.cancel')}
          variant="destructive"
          reasonLabel={t('confirmReason.label')}
          reasonPlaceholder={t('confirmReason.placeholder')}
          reasonRequired
          isPending={isPending}
          onConfirm={(reason) => {
            if (reason) {
              rejectMutation.mutate({ reason }, { onSuccess: () => setConfirmAction(null) });
            }
          }}
        />
      ) : null}

      {confirmAction === 'suspend' ? (
        <ConfirmWithReasonDialog
          open
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null);
          }}
          title={confirmConfig.suspend.title}
          description={confirmConfig.suspend.description}
          confirmLabel={confirmConfig.suspend.confirmLabel}
          cancelLabel={t('confirm.cancel')}
          variant="destructive"
          reasonLabel={t('confirmReason.label')}
          reasonPlaceholder={t('confirmReason.placeholder')}
          reasonRequired
          isPending={isPending}
          onConfirm={(reason) => {
            if (reason) {
              suspendMutation.mutate({ reason }, { onSuccess: () => setConfirmAction(null) });
            }
          }}
        />
      ) : null}
    </>
  );
}
