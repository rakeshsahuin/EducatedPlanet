"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoData } from "@educatedplanet/models";
import { cn } from "@/lib/utils";

interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: PhotoData[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function GalleryModal({
  open,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
  onDelete,
}: GalleryModalProps) {
  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "Escape":
          onOpenChange(false);
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    },
    [open, onOpenChange, goToPrevious, goToNext]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const handleDownload = useCallback(() => {
    if (currentImage?.url) {
      const link = document.createElement("a");
      link.href = currentImage.url;
      link.download = currentImage.filename || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentImage]);

  const handleDelete = useCallback(() => {
    if (onDelete && currentImage) {
      onDelete(currentIndex);
      // Close modal if this was the last image
      if (images.length === 1) {
        onOpenChange(false);
      } else if (currentIndex === images.length - 1) {
        // If deleting the last image, go to previous
        onIndexChange(currentIndex - 1);
      }
    }
  }, [currentIndex, currentImage, images.length, onDelete, onIndexChange, onOpenChange]);

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Gallery Image Viewer</DialogTitle>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="relative h-full flex flex-col bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-white bg-white/20">
                  {currentIndex + 1} / {images.length}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-5 w-5" />
                </Button>

                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-white hover:bg-red-500/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative max-w-full max-h-full">
              <img
                src={currentImage.url}
                alt={currentImage.filename || `Gallery image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onLoad={(e) => {
                  // Ensure image is visible
                  e.currentTarget.style.opacity = '1';
                }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="text-center text-white">
              <p className="font-medium">{currentImage.filename}</p>
              {currentImage.uploaded && (
                <p className="text-sm opacity-75">
                  Uploaded {new Date(currentImage.uploaded).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4">
              <div className="flex gap-1 overflow-x-auto py-2 px-1 bg-black/30 rounded-lg backdrop-blur-sm">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => onIndexChange(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all",
                      index === currentIndex
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}