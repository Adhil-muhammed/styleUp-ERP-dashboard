import { useCallback } from 'react';

import { useAuthStore } from '@/shared/lib/auth-store';
import { useScopeStore } from '@/shared/lib/scope-store';

export type ScopeValue = {
  isAdmin: boolean;
  merchantId: string | null;
  shopId: string | null;
  selectedMerchantId: string | null;
  setSelectedMerchantId: (merchantId: string | null) => void;
};

export function useScope(): ScopeValue {
  const role = useAuthStore((state) => state.user?.role);
  const userMerchantId = useAuthStore((state) => state.user?.merchantId ?? null);
  const selectedMerchantId = useScopeStore((state) => state.selectedMerchantId);
  const setSelectedMerchantIdStore = useScopeStore((state) => state.setSelectedMerchantId);

  const isAdmin = role === 'super_admin';
  const merchantId = isAdmin ? selectedMerchantId : userMerchantId;

  const setSelectedMerchantId = useCallback(
    (id: string | null) => {
      if (!isAdmin) {
        return;
      }
      setSelectedMerchantIdStore(id);
    },
    [isAdmin, setSelectedMerchantIdStore],
  );

  return {
    isAdmin,
    merchantId,
    shopId: merchantId,
    selectedMerchantId: isAdmin ? selectedMerchantId : userMerchantId,
    setSelectedMerchantId,
  };
}
