import type React from 'react';
import { APP_NAME } from '@/shared/lib/constants';

export function Header(): React.ReactElement {
  return (
    <header className="border-b border-border px-6 py-4" data-testid="app-header">
      <span>{APP_NAME}</span>
    </header>
  );
}
