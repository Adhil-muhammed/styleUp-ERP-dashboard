import type { ApiListParams } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';
import { z } from 'zod';

export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type ShopListItem = {
  id: string;
  shopName: string;
  ownerName: string;
  rating: number;
  status: ShopStatus;
  city: string;
  activeServices: number;
  activeStaff: number;
  isFeatured: boolean;
  logoUrl?: string;
};

export type ShopListParams = ApiListParams & {
  status?: ShopStatus;
  city?: string;
  sortBy?: keyof Pick<
    ShopListItem,
    'shopName' | 'ownerName' | 'rating' | 'status' | 'city' | 'activeServices' | 'activeStaff'
  >;
};

export type ShopListResponse = PaginatedResponse<ShopListItem>;

export const UpdateShopGeneralSchema = z.object({
  shopName: z.string().min(1),
  ownerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(1),
  city: z.string().min(1),
  description: z.string().optional(),
});

export type UpdateShopGeneralInput = z.infer<typeof UpdateShopGeneralSchema>;

export const RejectShopSchema = z.object({
  reason: z.string().min(3),
});

export type RejectShopInput = z.infer<typeof RejectShopSchema>;

export const SuspendShopSchema = z.object({
  reason: z.string().min(3),
});

export type SuspendShopInput = z.infer<typeof SuspendShopSchema>;
