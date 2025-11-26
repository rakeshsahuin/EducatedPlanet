import { CloudflareImageResponse } from '@educatedplanet/common';

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
        error: result.error || 'Upload failed',
        details: result
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