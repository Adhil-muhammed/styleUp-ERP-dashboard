import type { ShopGalleryImage } from '@/features/merchant-management/types/shop-tabs';

const placeholderImages: ShopGalleryImage[] = [
  { id: 'img-001', url: 'https://picsum.photos/seed/salon1/400/400', alt: 'Salon interior', uploadedAt: '2026-01-10T10:00:00Z' },
  { id: 'img-002', url: 'https://picsum.photos/seed/salon2/400/400', alt: 'Styling station', uploadedAt: '2026-01-15T14:00:00Z' },
  { id: 'img-003', url: 'https://picsum.photos/seed/salon3/400/400', alt: 'Reception area', uploadedAt: '2026-02-01T09:00:00Z' },
];

export const shopGalleryFixture: Record<string, ShopGalleryImage[]> = {
  'shp-001': [...placeholderImages],
  'shp-003': placeholderImages.slice(0, 2),
};

export function getGalleryForShop(shopId: string): ShopGalleryImage[] {
  return shopGalleryFixture[shopId] ?? [];
}
