import { Trash2 } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

export type GalleryImage = {
  id: string;
  url: string;
  alt?: string;
};

export type ImageGalleryGridProps = {
  images: GalleryImage[];
  isLoading?: boolean;
  onDelete?: (imageId: string) => void;
  isDeleting?: boolean;
  className?: string;
};

export function ImageGalleryGrid({
  images,
  isLoading = false,
  onDelete,
  isDeleting = false,
  className,
}: ImageGalleryGridProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="gallery-empty">
        {t('gallery.empty')}
      </p>
    );
  }

  return (
    <div
      className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4', className)}
      data-testid="image-gallery-grid"
    >
      {images.map((image) => (
        <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border">
          <img src={image.url} alt={image.alt ?? ''} className="size-full object-cover" />
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
              disabled={isDeleting}
              onClick={() => onDelete(image.id)}
              aria-label={t('gallery.delete')}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
