'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, Camera } from 'lucide-react';
import { validateImageFile } from '@/lib/image-upload';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (file: File, previewUrl: string) => void;
  initialImage?: string;
}

export function ImageUploadModal({
  open,
  onOpenChange,
  onImageSelect,
  initialImage
}: ImageUploadModalProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setImageSrc('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setError('');
      setDragActive(false);
    }
  }, [open]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setImageSrc(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleConfirmCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      // Convert canvas to blob
      croppedImage.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'tutor-photo.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          onImageSelect(file, previewUrl);
          onOpenChange(false);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Error cropping image:', error);
      setError('Failed to crop image. Please try again.');
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onImageSelect, onOpenChange]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!imageSrc ? (
            // Upload area
            <div>
              <Label htmlFor="photo-upload" className="block text-sm font-medium mb-2">
                Select or drag and drop a photo
              </Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>

                  <div>
                    <p className="text-lg font-medium">Drop your photo here</p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse from your computer
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileSelect}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Photo
                  </Button>

                  <p className="text-xs text-gray-500">
                    JPEG, PNG, or WebP • Max 5MB • 1:1 ratio recommended
                  </p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            // Cropping area
            <div className="space-y-4">
              <div className="text-sm font-medium">
                Adjust the photo to fit perfectly
              </div>

              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zoom-slider">Zoom</Label>
                <input
                  id="zoom-slider"
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImageSrc('')}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Choose Different Photo
                </Button>

                <Button
                  type="button"
                  onClick={handleConfirmCrop}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm & Use Photo'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}