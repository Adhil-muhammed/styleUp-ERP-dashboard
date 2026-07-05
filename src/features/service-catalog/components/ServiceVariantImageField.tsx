import { useCallback } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { useUploadServiceVariantImageMutation } from '@/features/service-catalog/hooks/use-service-catalog-queries';
import { ImageUploadDropzone } from '@/shared/components/media/ImageUploadDropzone';
import { cn } from '@/shared/lib/utils';

type ServiceVariantImageFieldProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
};

export function ServiceVariantImageField({
  value,
  onChange,
  disabled = false,
}: ServiceVariantImageFieldProps): React.ReactElement {
  const { t } = useTranslation('service-catalog');
  const uploadMutation = useUploadServiceVariantImageMutation();

  const handleUpload = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      uploadMutation.mutate(file, {
        onSuccess: (url) => onChange(url),
      });
    },
    [onChange, uploadMutation],
  );

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt=""
            className={cn('h-32 w-full max-w-xs rounded-lg border object-cover')}
          />
          <button
            type="button"
            className="mt-2 text-sm text-destructive hover:underline"
            disabled={disabled || uploadMutation.isPending}
            onClick={() => onChange(undefined)}
          >
            {t('form.removeImage')}
          </button>
        </div>
      ) : null}
      <ImageUploadDropzone
        disabled={disabled || uploadMutation.isPending}
        onUpload={handleUpload}
        className="max-w-full"
      />
    </div>
  );
}
