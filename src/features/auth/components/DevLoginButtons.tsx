import type React from 'react';
import { useTranslation } from 'react-i18next';

import { findMockUserByEmail } from '@/features/auth/api/fixtures/users.fixture';
import { Button } from '@/shared/components/ui/button';

type DevLoginButtonsProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  isPending?: boolean;
};

export function DevLoginButtons({
  onLogin,
  isPending = false,
}: DevLoginButtonsProps): React.ReactElement | null {
  const { t } = useTranslation('auth');

  if (!import.meta.env.DEV) {
    return null;
  }

  const admin = findMockUserByEmail('admin@stylequest.in');
  const owner = findMockUserByEmail('owner@luxesalon.in');

  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      <p className="text-xs text-muted-foreground">{t('dev.title')}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || !admin}
          onClick={() => {
            if (admin) {
              void onLogin(admin.email, admin.password);
            }
          }}
        >
          {t('dev.loginAsAdmin')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || !owner}
          onClick={() => {
            if (owner) {
              void onLogin(owner.email, owner.password);
            }
          }}
        >
          {t('dev.loginAsShopOwner')}
        </Button>
      </div>
    </div>
  );
}
