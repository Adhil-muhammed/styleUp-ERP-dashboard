import { Download } from 'lucide-react';
import type React from 'react';

import { Button } from '@/shared/components/ui/button';

export type ExportButtonProps = {
  label: string;
  onExport: () => void;
  isPending?: boolean;
  disabled?: boolean;
};

export function ExportButton({
  label,
  onExport,
  isPending = false,
  disabled = false,
}: ExportButtonProps): React.ReactElement {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onExport}
      disabled={disabled || isPending}
      data-testid="export-button"
    >
      <Download className="size-4" />
      {label}
    </Button>
  );
}
