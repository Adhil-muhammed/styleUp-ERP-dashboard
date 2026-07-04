import type { ApiListParams } from '@/shared/types/api';
import type { PaginatedResponse } from '@/shared/types/common';
import { z } from 'zod';

export type CustomerStatus = 'active' | 'suspended' | 'pending';

export type CustomerListItem = {
  id: string;
  avatarUrl?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  xp: number;
  level: number;
  status: CustomerStatus;
  lastLoginAt: string | null;
};

export type CustomerListParams = ApiListParams & {
  status?: CustomerStatus;
  sortBy?: keyof Pick<
    CustomerListItem,
    'name' | 'email' | 'xp' | 'level' | 'lastLoginAt' | 'status'
  >;
};

export type CustomerListResponse = PaginatedResponse<CustomerListItem>;

export const UpdateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
});

export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
