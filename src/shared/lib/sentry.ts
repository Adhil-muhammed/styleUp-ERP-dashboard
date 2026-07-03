import * as Sentry from '@sentry/react';

import { env } from '@/shared/config/env';

export function initSentry(): void {
  if (!env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.VITE_APP_ENV,
  });
}
