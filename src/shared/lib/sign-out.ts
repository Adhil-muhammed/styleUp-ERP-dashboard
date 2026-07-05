import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/lib/auth-store';
import { queryClient } from '@/shared/lib/query-client';
import { useScopeStore } from '@/shared/lib/scope-store';

type SignOutOptions = {
  redirect?: boolean;
};

export function signOut(options?: SignOutOptions): void {
  useAuthStore.getState().logout();
  useScopeStore.getState().clearSelectedMerchantId();
  queryClient.clear();

  if (options?.redirect !== false) {
    window.location.href = ROUTES.login;
  }
}
