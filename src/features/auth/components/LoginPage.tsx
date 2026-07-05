import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthError, mockLogin } from '@/features/auth/api/auth-api';
import { DevLoginButtons } from '@/features/auth/components/DevLoginButtons';
import { LoginSchema, type LoginInput } from '@/features/auth/types/login.schema';
import { PageLoader } from '@/shared/components/loading/PageLoader';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/lib/auth-store';
import { APP_NAME } from '@/shared/lib/constants';
import { useScopeStore } from '@/shared/lib/scope-store';
import { cn } from '@/shared/lib/utils';
import { typography } from '@/theme/responsive';

export function LoginPage(): React.ReactElement {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const login = useAuthStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setErrorMessage(null);
    setIsPending(true);

    try {
      const user = await mockLogin(email, password);
      useScopeStore.getState().clearSelectedMerchantId();
      login(user);
      void navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(t('errors.invalidCredentials'));
      } else {
        setErrorMessage(t('errors.generic'));
      }
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = form.handleSubmit((values) => handleLogin(values.email, values.password));

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className={cn(typography.sectionTitle, 'font-semibold tracking-tight')}>
            {APP_NAME}
          </CardTitle>
          <CardDescription>{t('page.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              void onSubmit(event);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('fields.email')}
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isPending}
                {...form.register('email')}
              />
              {form.formState.errors.email?.message ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('fields.password')}
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isPending}
                {...form.register('password')}
              />
              {form.formState.errors.password?.message ? (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t('actions.signingIn') : t('actions.signIn')}
            </Button>
          </form>

          <DevLoginButtons onLogin={handleLogin} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
