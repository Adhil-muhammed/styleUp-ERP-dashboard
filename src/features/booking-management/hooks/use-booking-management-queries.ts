import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  getBookingById,
  getBookings,
  markBookingNoShow,
  rescheduleBooking,
  updateBookingNotes,
} from '@/features/booking-management/api/booking-management-api';
import type { BookingListParams } from '@/features/booking-management/types/booking';
import type {
  CancelBookingInput,
  RescheduleBookingInput,
  UpdateBookingNotesInput,
} from '@/features/booking-management/types/booking.schema';

function useInvalidateBookings() {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['booking-management', 'list'] });
    void queryClient.invalidateQueries({ queryKey: ['booking-management', 'detail'] });
  };
}

export function useBookingListQuery(params: BookingListParams) {
  return useQuery({
    queryKey: ['booking-management', 'list', params],
    queryFn: () => getBookings(params),
    placeholderData: keepPreviousData,
  });
}

export function useBookingDetailQuery(bookingId: string) {
  return useQuery({
    queryKey: ['booking-management', 'detail', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useConfirmBookingMutation(bookingId: string) {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: () => confirmBooking(bookingId),
    onSuccess: invalidate,
  });
}

export function useRescheduleBookingMutation(bookingId: string) {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: (input: RescheduleBookingInput) => rescheduleBooking(bookingId, input),
    onSuccess: invalidate,
  });
}

export function useCancelBookingMutation(bookingId: string) {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: (input: CancelBookingInput) => cancelBooking(bookingId, input),
    onSuccess: invalidate,
  });
}

export function useCompleteBookingMutation(bookingId: string) {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: () => completeBooking(bookingId),
    onSuccess: invalidate,
  });
}

export function useMarkNoShowMutation(bookingId: string) {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: (input: CancelBookingInput) => markBookingNoShow(bookingId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateBookingNotesMutation(bookingId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: (input: UpdateBookingNotesInput) => updateBookingNotes(bookingId, input),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['booking-management', 'detail', bookingId],
      });
    },
  });
}
