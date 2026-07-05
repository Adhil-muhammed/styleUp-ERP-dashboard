import { z } from 'zod';

import type { ApiListParams } from '@/shared/types/api';

export type ServiceGender = 'male' | 'female' | 'unisex';
export type ServiceVariantStatus = 'active' | 'inactive';

export const SERVICE_GENDERS = ['male', 'female', 'unisex'] as const;

export type ServiceVariantRecord = {
  id: string;
  name: string;
  categoryId: string;
  gender: ServiceGender;
  durationMinutes: number;
  price: number;
  description?: string;
  imageUrl?: string;
  status: ServiceVariantStatus;
  sortOrder: number;
};

export type ServiceVariantListItem = ServiceVariantRecord & {
  categoryName: string;
};

export type ServiceVariantListParams = ApiListParams & {
  categoryId?: string;
  gender?: ServiceGender;
  status?: ServiceVariantStatus;
  sortBy?: 'sortOrder' | 'name' | 'price' | 'durationMinutes';
};

export const CreateServiceVariantSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  gender: z.enum(SERVICE_GENDERS),
  durationMinutes: z.number().int().positive(),
  price: z.number().positive(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  sortOrder: z.number().int().min(0),
});

export type CreateServiceVariantInput = z.infer<typeof CreateServiceVariantSchema>;

export const UpdateServiceVariantSchema = CreateServiceVariantSchema;

export type UpdateServiceVariantInput = z.infer<typeof UpdateServiceVariantSchema>;
