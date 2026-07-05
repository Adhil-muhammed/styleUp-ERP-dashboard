import { z } from 'zod';

import { STAFF_ROLES } from '@/features/staff-management/types/staff';

export const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(5),
  merchantId: z.string().min(1),
  role: z.enum(STAFF_ROLES),
  status: z.enum(['active', 'inactive']),
  availability: z.enum(['available', 'busy', 'off']),
  skillIds: z.array(z.string()),
});

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;

export const UpdateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(5),
  role: z.enum(STAFF_ROLES),
  status: z.enum(['active', 'inactive']),
  availability: z.enum(['available', 'busy', 'off']),
  skillIds: z.array(z.string()).optional(),
});

export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>;

export const AssignStaffShopSchema = z.object({
  merchantId: z.string().min(1),
});
