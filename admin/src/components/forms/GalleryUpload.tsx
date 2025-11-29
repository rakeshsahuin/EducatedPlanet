"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GalleryUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  currentImageCount?: number;
  disabled?: boolean;
}

export function GalleryUpload({
  onImagesSelected,
  maxImages = 20,
  currentImageCount = 0,
  disabled = false,
}: GalleryUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const remainingSlots = maxImages - currentImageCount;

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image format. Please use JPEG, PNG, or WebP.`);
        continue;
      }

      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} (maximum ${maxImages} images total).`);
      return validFiles.slice(0, remainingSlots);
    }

    return validFiles;
  }, [maxImages, remainingSlots]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled || remainingSlots === 0) return;

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onImagesSelected(validFiles);
      }
    },
    [disabled, remainingSlots, validateFiles, onImagesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onImagesSelected(validFiles);
      }
    },
    [validateFiles, onImagesSelected]
  );

  
  if (remainingSlots === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12 mb-2" />
            <p>Maximum number of images ({maxImages}) reached</p>
            <p className="text-sm">Remove some images to add new ones</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-dashed transition-colors",
        isDragOver && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <CardContent className="p-6">
        <div
          className={cn(
            "text-center space-y-4",
            !disabled && "cursor-pointer"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled) {
              document.getElementById('gallery-upload-input')?.click();
            }
          }}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>

          <div>
            <h3 className="font-medium">Add Gallery Images</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop images here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, or WebP (max 5MB each)
            </p>
            <p className="text-xs text-muted-foreground">
              {remainingSlots} of {maxImages} slots remaining
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('gallery-upload-input')?.click();
            }}
          >
            Select Images
          </Button>

          <input
            id="gallery-upload-input"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
            onChange={handleFileSelect}
          />
        </div>
      </CardContent>
    </Card>
  );
}