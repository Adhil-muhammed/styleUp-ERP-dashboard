import { useState } from 'react';
import type React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Textarea } from '@/shared/components/ui/textarea';

export type ConfirmWithReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'default' | 'destructive';
  onConfirm: (reason?: string) => void;
  isPending?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reasonRequired?: boolean;
  reasonMinLength?: number;
};

export function ConfirmWithReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  onConfirm,
  isPending = false,
  reasonLabel,
  reasonPlaceholder,
  reasonRequired = false,
  reasonMinLength = 3,
}: ConfirmWithReasonDialogProps): React.ReactElement {
  const [reason, setReason] = useState('');
  const showReason = reasonRequired || Boolean(reasonLabel);

  const isReasonValid = !reasonRequired || reason.trim().length >= reasonMinLength;

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setReason('');
    }
    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {showReason ? (
          <div className="space-y-2">
            {reasonLabel ? (
              <label htmlFor="confirm-reason" className="text-sm font-medium">
                {reasonLabel}
              </label>
            ) : null}
            <Textarea
              id="confirm-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={reasonPlaceholder}
              rows={3}
            />
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            disabled={isPending || !isReasonValid}
            onClick={(event) => {
              event.preventDefault();
              onConfirm(showReason ? reason.trim() : undefined);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
