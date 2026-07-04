import { MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export type ActionMenuItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  hidden?: boolean;
};

export type ActionMenuProps = {
  items: ActionMenuItem[];
  triggerLabel?: string;
};

export function ActionMenu({ items, triggerLabel }: ActionMenuProps): React.ReactElement {
  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={triggerLabel ?? 'Actions'}
          data-testid="action-menu-trigger"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.id}
              variant={item.variant}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {Icon ? <Icon /> : null}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
