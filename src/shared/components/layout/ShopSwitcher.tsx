import { ChevronDown, Store } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { shopsFixture } from '@/features/merchant-management/api/fixtures/shops.fixture';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useScope } from '@/shared/hooks/use-scope';
import { queryClient } from '@/shared/lib/query-client';
import { cn } from '@/shared/lib/utils';

const SWITCHER_SHOPS = shopsFixture.slice(0, 4);

export function ShopSwitcher(): React.ReactElement | null {
  const { t } = useTranslation('common');
  const { isAdmin, selectedMerchantId, setSelectedMerchantId } = useScope();

  if (!isAdmin) {
    return null;
  }

  const activeShop = SWITCHER_SHOPS.find((shop) => shop.id === selectedMerchantId);
  const label = activeShop?.shopName ?? t('scope.allShops');

  const handleSelect = (merchantId: string | null): void => {
    setSelectedMerchantId(merchantId);
    void queryClient.invalidateQueries();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-[220px] gap-2">
          <Store className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className={cn(!selectedMerchantId && 'bg-accent')}
          onClick={() => handleSelect(null)}
        >
          {t('scope.allShops')}
        </DropdownMenuItem>
        {SWITCHER_SHOPS.map((shop) => (
          <DropdownMenuItem
            key={shop.id}
            className={cn(selectedMerchantId === shop.id && 'bg-accent')}
            onClick={() => handleSelect(shop.id)}
          >
            {shop.shopName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
