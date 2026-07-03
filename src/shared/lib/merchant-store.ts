import { create } from 'zustand';

type MerchantState = {
  merchantId: string | null;
  setMerchantId: (merchantId: string | null) => void;
  clearMerchantId: () => void;
};

export const useMerchantStore = create<MerchantState>((set) => ({
  merchantId: null,
  setMerchantId: (merchantId) => set({ merchantId }),
  clearMerchantId: () => set({ merchantId: null }),
}));
