import { z } from 'zod';

import { REFUND_REASONS } from '@/features/payments/types/refund';

export const CreateRefundSchema = z
  .object({
    type: z.enum(['full', 'partial']),
    amountPaise: z.number().int().positive().optional(),
    reason: z.enum(REFUND_REASONS),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'partial' && data.amountPaise === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Partial refund requires an amount',
        path: ['amountPaise'],
      });
    }
  });

export type CreateRefundInput = z.infer<typeof CreateRefundSchema>;
