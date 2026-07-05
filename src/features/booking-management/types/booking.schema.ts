import { z } from 'zod';

export const RescheduleBookingSchema = z.object({
  scheduledAt: z.string().min(1),
});

export type RescheduleBookingInput = z.infer<typeof RescheduleBookingSchema>;

export const CancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;

export const UpdateBookingNotesSchema = z.object({
  internalNotes: z.string(),
});

export type UpdateBookingNotesInput = z.infer<typeof UpdateBookingNotesSchema>;

export const CreateBookingSchema = z.object({
  shopId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  staffId: z.string().min(1),
  serviceName: z.string().min(1),
  scheduledAt: z.string().min(1),
  durationMinutes: z.number().min(15).max(480),
  amount: z.number().min(0),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
