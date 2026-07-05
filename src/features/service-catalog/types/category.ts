import { z } from 'zod';

import type { ApiListParams } from '@/shared/types/api';

export type CategoryStatus = 'active' | 'inactive';

export type ServiceCategoryRecord = {
  id: string;
  name: string;
  imageUrl?: string;
  status: CategoryStatus;
};

export type ServiceCategoryListItem = ServiceCategoryRecord & {
  variantCount: number;
};

export type ServiceCategoryListParams = ApiListParams & {
  status?: CategoryStatus;
  sortBy?: 'name' | 'variantCount' | 'status';
};

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema;

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
