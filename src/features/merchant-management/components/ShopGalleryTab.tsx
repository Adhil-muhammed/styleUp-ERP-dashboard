import type React from 'react';

import {
  useDeleteGalleryImageMutation,
  useShopGalleryQuery,
  useUploadGalleryMutation,
} from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { ImageGalleryGrid } from '@/shared/components/media/ImageGalleryGrid';
import { ImageUploadDropzone } from '@/shared/components/media/ImageUploadDropzone';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Can } from '@/shared/lib/casl-context';
import { PERMISSIONS } from '@/shared/config/permissions';

export function ShopGalleryTab({ merchantId }: { merchantId: string }): React.ReactElement {
  const { data, isPending, isError } = useShopGalleryQuery(merchantId);
  const uploadMutation = useUploadGalleryMutation(merchantId);
  const deleteMutation = useDeleteGalleryImageMutation(merchantId);

  return (
    <QuerySection isPending={isPending} isError={isError}>
      <div className="space-y-4">
        <Can I="manage" a={PERMISSIONS.merchants.manage}>
          <ImageUploadDropzone
            disabled={uploadMutation.isPending}
            onUpload={(files) => uploadMutation.mutate(files)}
          />
        </Can>
        <ImageGalleryGrid
          images={data ?? []}
          onDelete={(imageId) => deleteMutation.mutate(imageId)}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </QuerySection>
  );
}
