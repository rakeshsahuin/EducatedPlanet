import { v4 as uuidv4 } from 'uuid';
import { ImageCategory, ImageValidationResult } from './types';

/**
 * Generate a unique filename for the uploaded image
 */
export function generateUniqueFilename(originalName?: string): string {
  const extension = originalName?.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  return `${timestamp}_${uuid}.${extension}`;
}

/**
 * Validate file based on category requirements
 */
export function validateFile(file: File, category: ImageCategory): ImageValidationResult {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > category.maxFileSize) {
    return {
      isValid: false,
      error: `File size ${fileSizeMB.toFixed(2)}MB exceeds maximum allowed size of ${category.maxFileSize}MB`,
      code: 'FILE_TOO_LARGE'
    };
  }

  // Check file type
  if (!category.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${category.allowedTypes.join(', ')}`,
      code: 'INVALID_FORMAT'
    };
  }

  // Additional checks for actual file content (optional but recommended)
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image',
      code: 'INVALID_FORMAT'
    };
  }

  return { isValid: true };
}

/**
 * Build Cloudflare variant URLs
 */
export function buildVariantUrls(accountId: string, imageId: string, variants: string[]): string[] {
  const baseUrl = `https://imagedelivery.net/${accountId}/${imageId}`;
  return variants.map(variant => `${baseUrl}/${variant}`);
}

/**
 * Extract file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExtension: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };
  return mimeToExtension[mimeType] || 'jpg';
}

/**
 * Check if value is a valid UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Sanitize metadata to remove potentially harmful content
 */
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Only allow string, number, boolean, and null values
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      // Sanitize string values
      if (typeof value === 'string') {
        // Remove potential script tags and dangerous characters
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}