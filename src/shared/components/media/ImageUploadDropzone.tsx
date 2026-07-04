import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export type ImageUploadDropzoneProps = {
  onUpload: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
};

export function ImageUploadDropzone({
  onUpload,
  disabled = false,
  className,
}: ImageUploadDropzoneProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    disabled,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      data-testid="image-upload-dropzone"
    >
      <input {...getInputProps()} />
      <Upload className="mb-2 size-8 text-muted-foreground" />
      <p className="text-sm font-medium">{t('gallery.uploadTitle')}</p>
      <p className="text-xs text-muted-foreground">{t('gallery.uploadHint')}</p>
    </div>
  );
}
