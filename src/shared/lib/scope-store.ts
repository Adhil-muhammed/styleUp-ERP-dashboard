import { create } from 'zustand';

type ScopeState = {
  selectedMerchantId: string | null;
  setSelectedMerchantId: (merchantId: string | null) => void;
  clearSelectedMerchantId: () => void;
};

export const useScopeStore = create<ScopeState>((set) => ({
  selectedMerchantId: null,
  setSelectedMerchantId: (merchantId) => set({ selectedMerchantId: merchantId }),
  clearSelectedMerchantId: () => set({ selectedMerchantId: null }),
}));
