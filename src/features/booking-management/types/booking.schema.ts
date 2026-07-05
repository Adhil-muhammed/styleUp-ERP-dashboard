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
