'use client';

import React, { useState, useRef } from 'react';
import { PhotoData } from '@educatedplanet/models';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Camera, Edit, Trash2, User } from 'lucide-react';
import { ImageUploadModal } from './ImageUploadModal';

interface TutorPhotoUploadProps {
  value?: PhotoData;
  onChange: (photo: PhotoData | undefined) => void;
  disabled?: boolean;
  name?: string; // For form field integration
}

export function TutorPhotoUpload({
  value,
  onChange,
  disabled = false,
}: TutorPhotoUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [forceRerender, setForceRerender] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File, preview: string) => {
    // Clean up previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Store the preview URL
    setPreviewUrl(preview);

    // Create a temporary PhotoData object with the local file
    // The actual upload will happen on form submission
    const tempPhotoData: PhotoData = {
      id: `temp-${Date.now()}`,
      filename: file.name,
      url: preview,
      uploaded: new Date().toISOString(),
      variants: [preview],
      metadata: {
        isTemporary: true,
        originalFile: file,
      }
    };

    onChange(tempPhotoData);
  };

  const handleRemovePhoto = () => {
    if (value?.metadata?.originalFile) {
      if (value.url && value.url.startsWith('blob:')) {
        URL.revokeObjectURL(value.url);
      }
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    onChange(undefined);
    // Force a re-render to ensure the AvatarFallback is shown
    setForceRerender(prev => prev + 1);
  };

  // Get initials for fallback
  const getInitials = (name?: string) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine if we have a real photo or a temporary one
  const hasPhoto = !!(value && !value.metadata?.isTemporary);
  const hasTempPhoto = !!(value && value.metadata?.isTemporary);
  const displayImage = value?.url || previewUrl;
  const hasValidImage = !!(displayImage && displayImage.length > 0 && displayImage !== '');

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <Avatar
            key={`${hasValidImage}-${forceRerender}`}
            className="w-32 h-32 border-4 border-background shadow-lg"
          >
            {hasValidImage && (
              <AvatarImage
                src={displayImage}
                alt="Tutor profile"
                className="object-cover"
              />
            )}
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          {/* Edit/Remove buttons overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {hasPhoto || hasTempPhoto ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setIsModalOpen(true)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change photo</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={handleRemovePhoto}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove photo</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      onClick={() => setIsModalOpen(true)}
                      className="h-8 w-8"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add photo</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">
            {hasPhoto || hasTempPhoto ? 'Profile Photo' : 'Add Profile Photo'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Professional headshots work best • JPEG, PNG, or WebP • Max 5MB
          </p>
        </div>

        {/* Hidden file input for accessibility */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Upload profile photo"
        />

        {/* Upload Modal */}
        <ImageUploadModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onImageSelect={handleImageSelect}
          initialImage={value?.url}
        />

        {/* Store the actual file for form submission */}
        {value?.metadata?.originalFile && (
          <input
            type="hidden"
            name="photoFile"
            value={JSON.stringify({
              name: value.metadata.originalFile.name,
              size: value.metadata.originalFile.size,
              type: value.metadata.originalFile.type,
            })}
          />
        )}
      </div>
    </TooltipProvider>
  );
}