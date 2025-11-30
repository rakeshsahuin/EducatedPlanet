import { CloudflareImageResponse } from '@educatedplanet/common';
import { PhotoData } from '@educatedplanet/models';

/**
 * Upload a tutor photo to Cloudflare Images
 * @param file - The image file to upload
 * @param tutorId - Optional tutor ID to associate with the image
 * @returns Promise with upload result
 */
export async function uploadTutorPhoto(
  file: File,
  tutorId?: string
): Promise<{ success: boolean; data?: CloudflareImageResponse; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'tutor-photo');
    formData.append('requireSignedURLs', 'false');

    if (tutorId) {
      formData.append('tutorId', tutorId);
    }

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed'
      };
    }

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Get available image upload categories
 * @returns Promise with categories list
 */
export async function getImageUploadCategories(): Promise<{
  success: boolean;
  data?: any;
  error?: string
}> {
  try {
    const response = await fetch('/api/upload/image', {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get categories'
      };
    }

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get categories'
    };
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    };
  }

  // Check file size (5MB for tutor photos)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please upload an image smaller than 5MB.'
    };
  }

  return { valid: true };
}

/**
 * Upload multiple gallery images to Cloudflare Images
 * @param files - Array of image files to upload
 * @param tutorId - Optional tutor ID to associate with the images
 * @param onProgress - Optional progress callback for each file
 * @returns Promise with upload results for all files
 */
export async function uploadGalleryImages(
  files: File[],
  tutorId?: string,
  onProgress?: (fileName: string, progress: number) => void
): Promise<{
  success: boolean;
  data?: PhotoData[];
  errors?: { fileName: string; error: string }[]
}> {
  const results: PhotoData[] = [];
  const errors: { fileName: string; error: string }[] = [];

  // Process files concurrently but with a limit of 3 at a time
  const concurrencyLimit = 3;
  const chunks: File[][] = [];

  for (let i = 0; i < files.length; i += concurrencyLimit) {
    chunks.push(files.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const uploadPromises = chunk.map(async (file) => {
      try {
        // Validate file before upload
        const validation = validateImageFile(file);
        if (!validation.valid) {
          errors.push({ fileName: file.name, error: validation.error || 'Validation failed' });
          return null;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', 'tutor-gallery');
        formData.append('requireSignedURLs', 'false');

        if (tutorId) {
          formData.append('tutorId', tutorId);
        }

        // Simulate progress for the upload
        if (onProgress) {
          onProgress(file.name, 0);

          // Create a progress simulation
          const progressInterval = setInterval(() => {
            const currentProgress = Math.random() * 90;
            onProgress(file.name, currentProgress);
          }, 200);

          try {
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              body: formData,
            });

            clearInterval(progressInterval);
            onProgress(file.name, 100);

            const result = await response.json();

            if (!response.ok) {
              errors.push({
                fileName: file.name,
                error: result.error || 'Upload failed'
              });
              return null;
            }

            // Transform CloudflareImageResponse to PhotoData
            const photoData: PhotoData = {
              id: result.data.id,
              filename: file.name,
              url: result.data.variants?.[0] || result.data.url,
              uploaded: new Date().toISOString(),
              variants: result.data.variants || [result.data.url],
              metadata: {
                originalName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploadedVia: 'gallery-batch-upload'
              }
            };

            return photoData;
          } catch (progressError) {
            clearInterval(progressInterval);
            throw progressError;
          }
        } else {
          // Upload without progress tracking
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            errors.push({
              fileName: file.name,
              error: result.error || 'Upload failed'
            });
            return null;
          }

          // Transform CloudflareImageResponse to PhotoData
          const photoData: PhotoData = {
            id: result.data.id,
            filename: file.name,
            url: result.data.variants?.[0] || result.data.url,
            uploaded: new Date().toISOString(),
            variants: result.data.variants || [result.data.url],
            metadata: {
              originalName: file.name,
              fileSize: file.size,
              fileType: file.type,
              uploadedVia: 'gallery-batch-upload'
            }
          };

          return photoData;
        }
      } catch (error) {
        errors.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
        return null;
      }
    });

    // Wait for current chunk to complete
    const chunkResults = await Promise.allSettled(uploadPromises);

    // Collect successful uploads
    chunkResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    });
  }

  return {
    success: errors.length === 0,
    data: results,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Delete an image from Cloudflare Images
 * @param imageId - The ID of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload/image/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        error: result.error || 'Failed to delete image'
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image'
    };
  }
}