import type { ServiceCategoryRecord } from '@/features/service-catalog/types/category';

export const categoriesFixture: ServiceCategoryRecord[] = [
  {
    id: 'cat-001',
    name: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop',
    status: 'active',
  },
  {
    id: 'cat-002',
    name: 'Beard',
    status: 'active',
  },
  {
    id: 'cat-003',
    name: 'Massage',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop',
    status: 'active',
  },
  {
    id: 'cat-004',
    name: 'Spa',
    status: 'active',
  },
  {
    id: 'cat-005',
    name: 'Skin Care',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd955ed5ad1?w=200&h=200&fit=crop',
    status: 'active',
  },
  {
    id: 'cat-006',
    name: 'Nails',
    status: 'inactive',
  },
];

export function getCategoryName(categoryId: string): string {
  return categoriesFixture.find((category) => category.id === categoryId)?.name ?? 'Unknown';
}
