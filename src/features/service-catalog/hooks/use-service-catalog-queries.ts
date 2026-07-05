import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCategory,
  createServiceVariant,
  deleteCategory,
  deleteServiceVariant,
  getCategories,
  getCategoryById,
  getServiceVariantById,
  getServiceVariants,
  updateCategory,
  updateServiceVariant,
  uploadServiceVariantImage,
} from '@/features/service-catalog/api/service-catalog-api';
import type {
  CreateCategoryInput,
  ServiceCategoryListParams,
  UpdateCategoryInput,
} from '@/features/service-catalog/types/category';
import type {
  CreateServiceVariantInput,
  ServiceVariantListParams,
  UpdateServiceVariantInput,
} from '@/features/service-catalog/types/service-variant';

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['service-catalog', 'categories'] });
    void queryClient.invalidateQueries({ queryKey: ['service-catalog', 'variants', 'list'] });
  };
}

function useInvalidateVariants() {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['service-catalog', 'variants'] });
    void queryClient.invalidateQueries({ queryKey: ['service-catalog', 'categories', 'list'] });
  };
}

export function useCategoryListQuery(params: ServiceCategoryListParams) {
  return useQuery({
    queryKey: ['service-catalog', 'categories', 'list', params],
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
  });
}

export function useCategoryQuery(categoryId: string) {
  return useQuery({
    queryKey: ['service-catalog', 'categories', 'detail', categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: Boolean(categoryId),
  });
}

export function useCreateCategoryMutation() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCategoryMutation(categoryId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => updateCategory(categoryId, input),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['service-catalog', 'categories', 'detail', categoryId],
      });
    },
  });
}

export function useDeleteCategoryMutation(categoryId: string) {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: () => deleteCategory(categoryId),
    onSuccess: invalidate,
  });
}

export function useServiceVariantListQuery(params: ServiceVariantListParams) {
  return useQuery({
    queryKey: ['service-catalog', 'variants', 'list', params],
    queryFn: () => getServiceVariants(params),
    placeholderData: keepPreviousData,
  });
}

export function useServiceVariantQuery(variantId: string) {
  return useQuery({
    queryKey: ['service-catalog', 'variants', 'detail', variantId],
    queryFn: () => getServiceVariantById(variantId),
    enabled: Boolean(variantId),
  });
}

export function useCreateServiceVariantMutation() {
  const invalidate = useInvalidateVariants();
  return useMutation({
    mutationFn: (input: CreateServiceVariantInput) => createServiceVariant(input),
    onSuccess: invalidate,
  });
}

export function useUpdateServiceVariantMutation(variantId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateVariants();
  return useMutation({
    mutationFn: (input: UpdateServiceVariantInput) => updateServiceVariant(variantId, input),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['service-catalog', 'variants', 'detail', variantId],
      });
    },
  });
}

export function useDeleteServiceVariantMutation(variantId: string) {
  const invalidate = useInvalidateVariants();
  return useMutation({
    mutationFn: () => deleteServiceVariant(variantId),
    onSuccess: invalidate,
  });
}

export function useUploadServiceVariantImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadServiceVariantImage(file),
  });
}
