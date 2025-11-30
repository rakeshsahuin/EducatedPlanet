export interface CloudflareImageResponse {
  id: string;
  filename: string;
  metadata?: Record<string, any>;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
}

export interface UploadImageOptions {
  file: File | Buffer;
  category: ImageCategory | string; // Can be category object or category name
  metadata?: Record<string, any>;
  requireSignedURLs?: boolean;
}

export interface ImageCategory {
  name: string; // e.g., 'tutor-photo', 'class-image', 'profile-picture'
  maxFileSize: number; // in MB
  allowedTypes: string[]; // e.g., ['image/jpeg', 'image/png']
  variants: string[]; // Cloudflare variant names
  customMetadata?: Record<string, any>;
}

export interface ImageUploadConfig {
  accountId: string;
  apiToken: string;
  apiUrl?: string;
  categories: Map<string, ImageCategory>;
  softDeleteRetentionHours?: number;
}

export interface SoftDeleteImage {
  imageId: string;
  deletedAt: Date;
  deletedBy: string;
  reason?: string;
}

export interface ImageUploadError {
  success: false;
  error: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_FORMAT' | 'UPLOAD_FAILED' | 'API_ERROR' | 'CATEGORY_NOT_FOUND';
  details?: any;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}

// Cloudflare API Response Types
export interface CloudflareApiError {
  message: string;
  code?: number;
}

export interface CloudflareImageInfo {
  total: number;
}

export interface CloudflareImageResult {
  id: string;
  filename?: string;
  metadata?: Record<string, any>;
  uploaded?: string;
  requireSignedURLs?: boolean;
  variants?: string[];
}

export interface CloudflareListImagesResult {
  images: CloudflareImageResult[];
  image_info: CloudflareImageInfo;
}

export interface CloudflareApiResponse<T = any> {
  success: boolean;
  result: T;
  errors?: CloudflareApiError[];
}

export interface CloudflareListImagesResponse extends CloudflareApiResponse<CloudflareListImagesResult> {}