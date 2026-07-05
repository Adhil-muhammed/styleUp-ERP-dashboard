import type { ReactNode } from 'react';
import type React from 'react';

import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/utils';
import { formSheet, zIndex } from '@/theme/responsive';

export type FormSheetContentProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
  side?: 'left' | 'right';
  className?: string;
};

export function FormSheetContent({
  title,
  children,
  footer,
  side = 'right',
  className,
}: FormSheetContentProps): React.ReactElement {
  return (
    <SheetContent
      side={side}
      className={cn(formSheet.content, zIndex.drawer, className)}
    >
      <SheetHeader className={formSheet.header}>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      <div className={formSheet.body}>{children}</div>
      <SheetFooter className={formSheet.footer}>{footer}</SheetFooter>
    </SheetContent>
  );
}
