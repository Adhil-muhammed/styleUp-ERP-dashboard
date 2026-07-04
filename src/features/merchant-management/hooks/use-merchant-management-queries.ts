import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  approveShop,
  deleteShopGalleryImage,
  getShopAuditLogs,
  getShopBookings,
  getShopById,
  getShopGallery,
  getShopPackages,
  getShopPerformance,
  getShopReviews,
  getShopServices,
  getShopStaff,
  getShops,
  getShopWorkingHours,
  rejectShop,
  suspendShop,
  toggleFeatureShop,
  updateShopGeneral,
  updateShopWorkingHours,
  uploadShopGalleryImages,
} from '@/features/merchant-management/api/merchant-management-api';
import type {
  RejectShopInput,
  ShopListParams,
  SuspendShopInput,
  UpdateShopGeneralInput,
} from '@/features/merchant-management/types/shop';
import type { ShopTabListParams } from '@/features/merchant-management/types/shop-tabs';
import type { WorkingHours } from '@/features/merchant-management/types/working-hours';
import type { PaginatedResponse } from '@/shared/types/common';
import type { ShopListItem } from '@/features/merchant-management/types/shop';

export function useShopListQuery(params: ShopListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'list', params],
    queryFn: () => getShops(params),
    placeholderData: keepPreviousData,
  });
}

export function useShopProfileQuery(merchantId: string) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId],
    queryFn: () => getShopById(merchantId),
    enabled: Boolean(merchantId),
  });
}

export function useShopWorkingHoursQuery(merchantId: string) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'working-hours'],
    queryFn: () => getShopWorkingHours(merchantId),
    enabled: Boolean(merchantId),
  });
}

export function useShopGalleryQuery(merchantId: string) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'gallery'],
    queryFn: () => getShopGallery(merchantId),
    enabled: Boolean(merchantId),
  });
}

export function useShopServicesQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'services', params],
    queryFn: () => getShopServices(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopPackagesQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'packages', params],
    queryFn: () => getShopPackages(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopStaffQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'staff', params],
    queryFn: () => getShopStaff(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopBookingsQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'bookings', params],
    queryFn: () => getShopBookings(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopReviewsQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'reviews', params],
    queryFn: () => getShopReviews(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopAuditLogsQuery(merchantId: string, params: ShopTabListParams) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'audit-history', params],
    queryFn: () => getShopAuditLogs(merchantId, params),
    enabled: Boolean(merchantId),
    placeholderData: keepPreviousData,
  });
}

export function useShopPerformanceQuery(merchantId: string, period: 7 | 30) {
  return useQuery({
    queryKey: ['merchant-management', 'detail', merchantId, 'performance', period],
    queryFn: () => getShopPerformance(merchantId, period),
    enabled: Boolean(merchantId),
  });
}

function useInvalidateShop(merchantId: string) {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['merchant-management', 'list'] });
    void queryClient.invalidateQueries({ queryKey: ['merchant-management', 'detail', merchantId] });
  };
}

export function useUpdateShopGeneralMutation(merchantId: string) {
  const invalidate = useInvalidateShop(merchantId);
  return useMutation({
    mutationFn: (data: UpdateShopGeneralInput) => updateShopGeneral(merchantId, data),
    onSuccess: invalidate,
  });
}

export function useUpdateWorkingHoursMutation(merchantId: string) {
  const invalidate = useInvalidateShop(merchantId);
  return useMutation({
    mutationFn: (data: WorkingHours) => updateShopWorkingHours(merchantId, data),
    onSuccess: invalidate,
  });
}

export function useUploadGalleryMutation(merchantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => uploadShopGalleryImages(merchantId, files),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['merchant-management', 'detail', merchantId, 'gallery'],
      });
    },
  });
}

export function useDeleteGalleryImageMutation(merchantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => deleteShopGalleryImage(merchantId, imageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['merchant-management', 'detail', merchantId, 'gallery'],
      });
    },
  });
}

export function useApproveShopMutation(merchantId: string) {
  const invalidate = useInvalidateShop(merchantId);
  return useMutation({ mutationFn: () => approveShop(merchantId), onSuccess: invalidate });
}

export function useRejectShopMutation(merchantId: string) {
  const invalidate = useInvalidateShop(merchantId);
  return useMutation({
    mutationFn: (input: RejectShopInput) => rejectShop(merchantId, input),
    onSuccess: invalidate,
  });
}

export function useSuspendShopMutation(merchantId: string) {
  const invalidate = useInvalidateShop(merchantId);
  return useMutation({
    mutationFn: (input: SuspendShopInput) => suspendShop(merchantId, input),
    onSuccess: invalidate,
  });
}

export function useFeatureShopMutation(listParams: ShopListParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ merchantId, featured }: { merchantId: string; featured: boolean }) =>
      toggleFeatureShop(merchantId, featured),
    onMutate: async ({ merchantId, featured }) => {
      await queryClient.cancelQueries({ queryKey: ['merchant-management', 'list', listParams] });
      const previous = queryClient.getQueryData<PaginatedResponse<ShopListItem>>([
        'merchant-management',
        'list',
        listParams,
      ]);
      if (previous) {
        queryClient.setQueryData(['merchant-management', 'list', listParams], {
          ...previous,
          data: previous.data.map((shop) =>
            shop.id === merchantId ? { ...shop, isFeatured: featured } : shop,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['merchant-management', 'list', listParams], context.previous);
      }
    },
    onSettled: (_data, _err, { merchantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['merchant-management', 'list'] });
      void queryClient.invalidateQueries({
        queryKey: ['merchant-management', 'detail', merchantId],
      });
    },
  });
}
