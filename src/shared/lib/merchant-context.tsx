import { createContext, useContext, type ReactNode } from 'react';

import { useMerchantStore } from '@/shared/lib/merchant-store';

type MerchantContextValue = {
  merchantId: string | null;
};

const MerchantContext = createContext<MerchantContextValue | undefined>(undefined);

type MerchantProviderProps = {
  children: ReactNode;
};

export function MerchantProvider({ children }: MerchantProviderProps): React.ReactElement {
  const merchantId = useMerchantStore((state) => state.merchantId);

  return (
    <MerchantContext.Provider value={{ merchantId }}>{children}</MerchantContext.Provider>
  );
}

export function useMerchantContext(): MerchantContextValue {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchantContext must be used within MerchantProvider');
  }
  return context;
}
