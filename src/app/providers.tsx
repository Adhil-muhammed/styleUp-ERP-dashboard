import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';

import { AbilityBridge } from '@/app/providers/AbilityBridge';
import i18n from '@/shared/lib/i18n';
import { MerchantProvider } from '@/shared/lib/merchant-context';
import { queryClient } from '@/shared/lib/query-client';
import { ThemeProvider } from '@/shared/lib/theme-provider';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AbilityBridge>
          <MerchantProvider>
            <ThemeProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </MerchantProvider>
        </AbilityBridge>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
