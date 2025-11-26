import { ImageCategory } from './types';

export const DEFAULT_IMAGE_CATEGORIES: Record<string, ImageCategory> = {
  'tutor-photo': {
    name: 'tutor-photo',
    maxFileSize: 5, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    variants: ['public', 'thumbnail', 'card'],
    customMetadata: { purpose: 'profile' }
  },
  'class-image': {
    name: 'class-image',
    maxFileSize: 10, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    variants: ['public', 'banner', 'thumbnail'],
    customMetadata: { purpose: 'education' }
  },
  'profile-picture': {
    name: 'profile-picture',
    maxFileSize: 2, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    variants: ['public', 'avatar', 'thumbnail'],
    customMetadata: { purpose: 'avatar' }
  }
};

export function getCategoryConfig(categoryName: string): ImageCategory | null {
  return DEFAULT_IMAGE_CATEGORIES[categoryName] || null;
}

export function validateCategory(category: ImageCategory): ImageCategory {
  const defaults = {
    maxFileSize: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    variants: ['public'],
    customMetadata: {}
  };

  return {
    name: category.name || 'custom',
    maxFileSize: category.maxFileSize || defaults.maxFileSize,
    allowedTypes: category.allowedTypes || defaults.allowedTypes,
    variants: category.variants || defaults.variants,
    customMetadata: category.customMetadata || defaults.customMetadata
  };
}