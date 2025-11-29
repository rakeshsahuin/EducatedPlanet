"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { GalleryUpload } from "./GalleryUpload";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryModal } from "./GalleryModal";
import { PhotoData } from "@educatedplanet/models";

interface GalleryContainerProps {
  value: PhotoData[];
  onChange: (images: PhotoData[]) => void;
  tutorId?: string;
  maxImages?: number;
  disabled?: boolean;
}

export function GalleryContainer({
  value = [],
  onChange,
  tutorId,
  maxImages = 20,
  disabled = false,
}: GalleryContainerProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [internalValue, setInternalValue] = useState<PhotoData[]>(value);

  // Keep internal state in sync with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Keep track of blob URLs to cleanup
  const blobUrlsRef = useRef<string[]>([]);

  // Update ref when internalValue changes
  useEffect(() => {
    blobUrlsRef.current = internalValue
      .filter(image => image.url.startsWith('blob:'))
      .map(image => image.url.split('#')[0]);
  }, [internalValue]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleImagesSelected = useCallback(
    async (files: File[]) => {
      // Store files in memory as PhotoData with temporary blob URLs
      const timestamp = Date.now();
      const newImages: PhotoData[] = files.map((file, index) => {
        const id = `temp-${timestamp}-${index}`;
        const url = URL.createObjectURL(file);

        // Create a unique URL with timestamp to force React to recognize it as new
        const uniqueUrl = `${url}#${timestamp}`;

        return {
          id,
          filename: file.name,
          url: uniqueUrl,
          uploaded: new Date().toISOString(),
          variants: [uniqueUrl],
          metadata: {
            isTemporary: true,
            originalFile: file,
            fileSize: file.size,
            fileType: file.type,
            timestamp,
          },
        };
      });

      // Update internal state immediately
      const updatedGallery = [...internalValue, ...newImages];
      console.log('GalleryContainer: Adding images', {
        newImagesCount: newImages.length,
        totalImages: updatedGallery.length,
        firstImageUrl: newImages[0]?.url,
        firstImageId: newImages[0]?.id
      });
      setInternalValue(updatedGallery);

      // Update form state
      onChange(updatedGallery);

      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added to gallery`);
      setShowUpload(false);
      setUploadingFiles([]);
    },
    [onChange, internalValue]
  );

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      const reorderedGallery = [...internalValue];
      const [removed] = reorderedGallery.splice(oldIndex, 1);
      reorderedGallery.splice(newIndex, 0, removed);
      setInternalValue(reorderedGallery);
      onChange(reorderedGallery);
    },
    [internalValue, onChange]
  );

  const handlePreview = useCallback((index: number) => {
    setPreviewIndex(index);
  }, []);

  const handleDelete = useCallback(
    async (index: number) => {
      const imageToDelete = internalValue[index];

      // Clean up object URL if it's a temporary image
      if (imageToDelete.url.startsWith('blob:')) {
        // Remove the timestamp hash before revoking
        const baseUrl = imageToDelete.url.split('#')[0];
        URL.revokeObjectURL(baseUrl);
      }

      const updatedGallery = internalValue.filter((_, i) => i !== index);
      setInternalValue(updatedGallery);
      onChange(updatedGallery);

      toast.success("Image removed from gallery");
    },
    [internalValue, onChange]
  );

  const handleModalDelete = useCallback(
    (index: number) => {
      handleDelete(index);

      // Update preview index if necessary
      if (previewIndex !== null) {
        if (internalValue.length === 1) {
          setPreviewIndex(null);
        } else if (index === previewIndex) {
          setPreviewIndex(Math.max(0, previewIndex - 1));
        } else if (index < previewIndex) {
          setPreviewIndex(previewIndex - 1);
        }
      }
    },
    [previewIndex, internalValue.length, handleDelete]
  );

  const handleCloseModal = useCallback(() => {
    setPreviewIndex(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      {internalValue.length > 0 && (
        <GalleryGrid
          images={internalValue}
          onReorder={handleReorder}
          onPreview={handlePreview}
          onDelete={handleDelete}
          onAddMore={() => setShowUpload(true)}
          maxImages={maxImages}
          disabled={disabled}
        />
      )}

      {/* Upload Section - Show when gallery is empty or when user clicks "Add More" */}
      {(internalValue.length === 0 || showUpload) && (
        <GalleryUpload
          onImagesSelected={handleImagesSelected}
          maxImages={maxImages}
          currentImageCount={internalValue.length}
          disabled={disabled || uploadingFiles.length > 0}
        />
      )}

      {/* Cancel button when showing upload form but gallery is not empty */}
      {showUpload && internalValue.length > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowUpload(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel adding images
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewIndex !== null && (
        <GalleryModal
          open={previewIndex !== null}
          onOpenChange={handleCloseModal}
          images={internalValue}
          currentIndex={previewIndex}
          onIndexChange={setPreviewIndex}
          onDelete={handleModalDelete}
        />
      )}
    </div>
  );
}